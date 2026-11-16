'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { settle } = require('../src/settle');
const { ValidationError } = require('../src/split');

test('trip expenses settle with the fewest transfers', () => {
  const r = settle({
    people: ['Noya', 'Dana', 'Lior'],
    expenses: [
      { title: 'Hotel', amount: 900, payer: 'Noya' },
      { title: 'Taxi', amount: 120, payer: 'Dana', people: ['Dana', 'Lior'] },
      { title: 'Dinner', amount: 300, payer: 'Lior' }
    ]
  });
  assert.equal(r.total, 1320);
  assert.deepEqual(r.balances.map((b) => b.net), [500, -340, -160]);
  assert.deepEqual(r.transfers, [{ from: 'Dana', to: 'Noya', amount: 340 }, { from: 'Lior', to: 'Noya', amount: 160 }]);
  assert.equal(Math.round(r.balances.reduce((a, b) => a + b.net * 100, 0)), 0);
});

test('settle rejects bad input', () => {
  assert.throws(() => settle({ people: ['A'], expenses: [] }), ValidationError);
  assert.throws(() => settle({ people: ['A', 'A'], expenses: [{ amount: 5, payer: 'A' }] }), ValidationError);
  assert.throws(() => settle({ people: ['A', 'B'], expenses: [{ amount: 5, payer: 'Z' }] }), ValidationError);
});
