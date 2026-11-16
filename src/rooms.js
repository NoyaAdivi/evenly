'use strict';
const crypto = require('node:crypto');
const { allocate, ValidationError } = require('./split');

/**
 * Group links: the host shares a link, every friend opens it on their own
 * phone and taps the dishes they had. Rooms live in memory for 24 hours,
 * which is enough for one dinner (a restart clears them).
 */
const TTL = 24 * 60 * 60 * 1000;
const MAX_ROOMS = 1000;
const rooms = new Map();

const text = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const newId = () => crypto.randomBytes(5).toString('base64url').replace(/[-_]/g, 'x').slice(0, 7);

function sweep(now = Date.now()) {
  for (const [id, r] of rooms) if (now - r.touched > TTL) rooms.delete(id);
}

function createRoom({ title, items, tipPercent = 0, people } = {}) {
  sweep();
  if (rooms.size >= MAX_ROOMS) throw new ValidationError('too many open rooms, try again later');
  if (!Array.isArray(items) || items.length === 0) throw new ValidationError('a room needs at least one item');
  if (items.length > 200) throw new ValidationError('too many items (max 200)');
  if (typeof tipPercent !== 'number' || tipPercent < 0 || tipPercent > 100) throw new ValidationError('tipPercent must be between 0 and 100');
  const room = {
    id: newId(),
    title: text(title, 60) || 'Evenly',
    tipPercent,
    people: [],
    items: items.map((it, n) => {
      const qty = Number.isInteger(it?.qty) && it.qty > 0 ? Math.min(it.qty, 99) : 1;
      if (typeof it?.price !== 'number' || !Number.isFinite(it.price) || it.price < 0) throw new ValidationError(`item #${n + 1} needs a price`);
      return { id: n + 1, name: text(it.name, 60) || `#${n + 1}`, price: it.price, qty, claims: [] };
    }),
    version: 1,
    touched: Date.now()
  };
  (Array.isArray(people) ? people : []).slice(0, 50).forEach((p) => join(room, p));
  rooms.set(room.id, room);
  return view(room);
}

function getRoom(id) {
  const room = rooms.get(String(id));
  if (!room || Date.now() - room.touched > TTL) return null;
  return room;
}

function join(room, name) {
  const n = text(name, 30);
  if (!n) throw new ValidationError('name is required');
  if (!room.people.includes(n)) {
    if (room.people.length >= 50) throw new ValidationError('room is full');
    room.people.push(n);
  }
  return n;
}

function claim(room, { name, itemId, on = true } = {}) {
  const n = join(room, name);
  const item = room.items.find((it) => it.id === itemId);
  if (!item) throw new ValidationError('unknown item');
  const has = item.claims.includes(n);
  if (on && !has) item.claims.push(n);
  if (!on && has) item.claims = item.claims.filter((x) => x !== n);
  touch(room);
}

function touch(room) { room.version += 1; room.touched = Date.now(); }

/** Public view: items, who claimed them, and what each person owes so far. */
function view(room) {
  const owe = Object.fromEntries(room.people.map((p) => [p, 0]));
  let claimed = 0;
  let unclaimed = 0;
  for (const it of room.items) {
    const cents = Math.round(it.price * it.qty * 100);
    if (!it.claims.length) { unclaimed += cents; continue; }
    claimed += cents;
    const each = Math.floor(cents / it.claims.length);
    let left = cents - each * it.claims.length;
    it.claims.forEach((p) => { owe[p] += each + (left-- > 0 ? 1 : 0); });
  }
  const tipOf = (c) => Math.round((c * room.tipPercent) / 100);
  const tips = allocate(tipOf(claimed), room.people.map((p) => owe[p]));
  return {
    id: room.id,
    title: room.title,
    tipPercent: room.tipPercent,
    version: room.version,
    people: room.people,
    items: room.items.map(({ id, name, price, qty, claims }) => ({ id, name, price, qty, claims })),
    totals: room.people.map((p, i) => ({ name: p, amount: (owe[p] + tips[i]) / 100 })),
    claimed: claimed / 100,
    unclaimed: unclaimed / 100,
    total: (claimed + unclaimed + tipOf(claimed + unclaimed)) / 100
  };
}

module.exports = { createRoom, getRoom, join, claim, view, touch, _rooms: rooms };
