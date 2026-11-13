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
