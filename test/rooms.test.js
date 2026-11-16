'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const R = require('../src/rooms');

test('friends claim their dishes in a group room', () => {
  const v = R.createRoom({ items: [{ name: 'Pizza', price: 60 }, { name: 'Beer', price: 30, qty: 2 }], tipPercent: 10 });
  const room = R.getRoom(v.id);
  R.claim(room, { name: 'Noya', itemId: 1 });
  R.claim(room, { name: 'Dana', itemId: 1 });
  R.claim(room, { name: 'Dana', itemId: 2 });
  const out = R.view(room);
  assert.deepEqual(out.totals, [{ name: 'Noya', amount: 33 }, { name: 'Dana', amount: 99 }]);
  assert.equal(out.unclaimed, 0);
  R.claim(room, { name: 'Dana', itemId: 2, on: false });
  assert.equal(R.view(room).unclaimed, 60);
});

test('unknown rooms are null', () => {
  assert.equal(R.getRoom('nope'), null);
});
