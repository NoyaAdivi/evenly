'use strict';

/**
 * Split a bill between guests, exactly to the agora/cent.
 * mode "equal"  -> everyone pays the same
 * mode "nights" -> each guest pays by the number of nights they stayed (hotel)
 * mode "items"  -> each guest pays for the dishes they had (restaurant);
 *                  a dish shared by several people is split between them,
 *                  a dish with no people is shared by everyone
 * tipPercent adds a tip (or service charge), split by what each person ate.
 * Remainders are given out with the largest remainder method,
 * so the shares always add up to the total.
 */
const MODES = ['equal', 'nights', 'items'];

class ValidationError extends Error {}

/** Split an integer amount of cents by weights, never losing a cent. */
function allocate(cents, weights) {
  const sum = weights.reduce((a, b) => a + b, 0);
  if (sum === 0) return weights.map(() => 0);
  const raw = weights.map((w) => (cents * w) / sum);
  const out = raw.map(Math.floor);
  let left = cents - out.reduce((a, b) => a + b, 0);
  raw
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac || a.i - b.i)
    .forEach(({ i }) => { if (left > 0) { out[i] += 1; left -= 1; } });
  return out;
}

function checkGuests(guests) {
  if (!Array.isArray(guests) || guests.length === 0) {
    throw new ValidationError('guests must be a non empty array');
  }
  if (guests.length > 100) throw new ValidationError('too many guests (max 100)');
  guests.forEach((g, i) => {
    if (!g || typeof g.name !== 'string' || !g.name.trim()) {
      throw new ValidationError(`guest #${i + 1} needs a name`);
    }
  });
}

function itemSubtotals(items, guests) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new ValidationError('items mode needs a non empty items array');
  }
  if (items.length > 300) throw new ValidationError('too many items (max 300)');
  const names = guests.map((g) => g.name.trim());
  const sub = names.map(() => 0);
  const lines = names.map(() => []);

  items.forEach((it, n) => {
    const label = (it && typeof it.name === 'string' && it.name.trim()) || `item #${n + 1}`;
    const qty = it?.qty ?? 1;
    if (typeof it?.price !== 'number' || !Number.isFinite(it.price) || it.price < 0) {
      throw new ValidationError(`"${label}" needs a price of 0 or more`);
    }
    if (!Number.isInteger(qty) || qty <= 0) throw new ValidationError(`"${label}" needs a whole quantity`);
    const people = Array.isArray(it.people) && it.people.length ? it.people : names;
    const idx = people.map((p) => {
      const i = typeof p === 'number' ? p : names.indexOf(String(p).trim());
      if (!Number.isInteger(i) || i < 0 || i >= names.length) {
        throw new ValidationError(`"${label}" is linked to an unknown guest "${p}"`);
      }
      return i;
    });
    const unique = [...new Set(idx)];
    const cents = Math.round(it.price * qty * 100);
    allocate(cents, unique.map(() => 1)).forEach((c, k) => {
      sub[unique[k]] += c;
      lines[unique[k]].push({ name: label, amount: c / 100, sharedWith: unique.length });
    });
  });
  return { sub, lines };
}

function splitBill({ total, guests, mode = 'equal', currency = 'ILS', items, tipPercent = 0 } = {}) {
  if (!MODES.includes(mode)) throw new ValidationError('mode must be "equal", "nights" or "items"');
  checkGuests(guests);
  if (typeof tipPercent !== 'number' || !Number.isFinite(tipPercent) || tipPercent < 0 || tipPercent > 100) {
    throw new ValidationError('tipPercent must be between 0 and 100');
  }

  let sub;
  let lines = null;
  if (mode === 'items') {
    ({ sub, lines } = itemSubtotals(items, guests));
  } else {
    if (typeof total !== 'number' || !Number.isFinite(total) || total <= 0) {
      throw new ValidationError('total must be a positive number');
    }
    const weights = guests.map((g) => {
      if (mode === 'equal') return 1;
      if (!Number.isInteger(g.nights) || g.nights <= 0) {
        throw new ValidationError(`guest "${g.name}" needs a positive whole number of nights`);
      }
      return g.nights;
    });
    sub = allocate(Math.round(total * 100), weights);
  }

  const subtotal = sub.reduce((a, b) => a + b, 0);
  if (subtotal <= 0) throw new ValidationError('the bill adds up to 0');
  const tipCents = Math.round((subtotal * tipPercent) / 100);
  const tips = allocate(tipCents, sub);

  return {
    currency,
    mode,
    subtotal: subtotal / 100,
    tipPercent,
    tip: tipCents / 100,
    total: (subtotal + tipCents) / 100,
    shares: guests.map((g, i) => ({
      name: g.name.trim(),
      amount: (sub[i] + tips[i]) / 100,
      ...(tipCents ? { tip: tips[i] / 100 } : {}),
      ...(lines ? { items: lines[i] } : {})
    }))
  };
}

module.exports = { splitBill, allocate, ValidationError, MODES };
