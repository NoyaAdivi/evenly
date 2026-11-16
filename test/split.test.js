'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { splitBill, ValidationError } = require('../src/split');

const sum = (r) => Math.round(r.shares.reduce((a, s) => a + s.amount * 100, 0));

test('equal split adds up exactly', () => {
  const r = splitBill({ total: 100, guests: [{ name: 'Noya' }, { name: 'Dana' }, { name: 'Lior' }] });
  assert.deepEqual(r.shares.map((s) => s.amount), [33.34, 33.33, 33.33]);
  assert.equal(sum(r), 10000);
});

test('split by nights', () => {
  const r = splitBill({
    total: 1200, mode: 'nights',
    guests: [{ name: 'A', nights: 3 }, { name: 'B', nights: 1 }]
  });
  assert.deepEqual(r.shares.map((s) => s.amount), [900, 300]);
});

test('odd totals never lose an agora', () => {
  for (let n = 1; n <= 13; n++) {
    const guests = Array.from({ length: n }, (_, i) => ({ name: `g${i}`, nights: i + 1 }));
    const r = splitBill({ total: 999.99, guests, mode: 'nights' });
    assert.equal(sum(r), 99999);
  }
});

test('rejects bad input', () => {
  assert.throws(() => splitBill({ total: -5, guests: [{ name: 'x' }] }), ValidationError);
  assert.throws(() => splitBill({ total: 10, guests: [] }), ValidationError);
  assert.throws(() => splitBill({ total: 10, guests: [{ name: '' }] }), ValidationError);
  assert.throws(() => splitBill({ total: 10, mode: 'nights', guests: [{ name: 'x', nights: 0 }] }), ValidationError);
  assert.throws(() => splitBill({ total: 10, mode: 'magic', guests: [{ name: 'x' }] }), ValidationError);
});

test('split by dishes, shared dish and tip', () => {
  const r = splitBill({
    mode: 'items', tipPercent: 10,
    guests: [{ name: 'Noya' }, { name: 'Dana' }, { name: 'Lior' }],
    items: [
      { name: 'Burger', price: 62, people: ['Noya'] },
      { name: 'Salad', price: 48, people: ['Dana'] },
      { name: 'Fries', price: 25, people: ['Noya', 'Dana', 'Lior'] },
      { name: 'Beer', price: 30, qty: 2, people: [2] }
    ]
  });
  assert.equal(r.subtotal, 195);
  assert.equal(r.tip, 19.5);
  assert.equal(r.total, 214.5);
  assert.equal(sum(r), 21450);
  assert.deepEqual(r.shares.map((s) => s.amount), [77.38, 61.96, 75.16]);
});

test('dish with no people is shared by everyone', () => {
  const r = splitBill({ mode: 'items', guests: [{ name: 'A' }, { name: 'B' }], items: [{ name: 'Pizza', price: 99.99 }] });
  assert.deepEqual(r.shares.map((s) => s.amount), [50, 49.99]);
});

test('tip on equal split adds up', () => {
  const r = splitBill({ total: 100, tipPercent: 12, guests: [{ name: 'A' }, { name: 'B' }, { name: 'C' }] });
  assert.equal(r.total, 112);
  assert.equal(sum(r), 11200);
});

test('rejects bad items', () => {
  const g = [{ name: 'A' }];
  assert.throws(() => splitBill({ mode: 'items', guests: g, items: [] }), ValidationError);
  assert.throws(() => splitBill({ mode: 'items', guests: g, items: [{ name: 'x', price: -1 }] }), ValidationError);
  assert.throws(() => splitBill({ mode: 'items', guests: g, items: [{ name: 'x', price: 5, people: ['Z'] }] }), ValidationError);
  assert.throws(() => splitBill({ total: 10, tipPercent: 300, guests: g }), ValidationError);
});

test('percent, shares, exact and pools', () => {
  const g = [{ name: 'A', percent: 50, shares: 2, amount: 40 }, { name: 'B', percent: 30, shares: 1 }, { name: 'C', percent: 20, shares: 1 }];
  assert.deepEqual(splitBill({ total: 100, mode: 'percent', guests: g }).shares.map((s) => s.amount), [50, 30, 20]);
  assert.deepEqual(splitBill({ total: 100, mode: 'shares', guests: g }).shares.map((s) => s.amount), [50, 25, 25]);
  assert.deepEqual(splitBill({ total: 100, mode: 'exact', guests: g }).shares.map((s) => s.amount), [40, 30, 30]);
  const r = splitBill({ mode: 'pools', guests: g, pools: [{ name: 'Food', amount: 90 }, { name: 'Drinks', amount: 40, people: ['A', 'B'] }] });
  assert.deepEqual(r.shares.map((s) => s.amount), [50, 50, 30]);
  assert.throws(() => splitBill({ total: 100, mode: 'percent', guests: [{ name: 'A', percent: 60 }] }), ValidationError);
  assert.throws(() => splitBill({ total: 100, mode: 'exact', guests: [{ name: 'A', amount: 150 }, { name: 'B' }] }), ValidationError);
});
