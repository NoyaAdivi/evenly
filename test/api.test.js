'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { createApp } = require('../src/app');

let server;
let base;

test.before(async () => {
  server = createApp().listen(0);
  await new Promise((r) => server.once('listening', r));
  base = `http://127.0.0.1:${server.address().port}`;
});
test.after(() => server.close());

test('GET /health is ok', async () => {
  const res = await fetch(`${base}/health`);
  assert.equal(res.status, 200);
  assert.equal((await res.json()).status, 'ok');
});

test('POST /api/split returns shares', async () => {
  const res = await fetch(`${base}/api/split`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ total: 90, guests: [{ name: 'A' }, { name: 'B' }, { name: 'C' }] })
  });
  assert.equal(res.status, 200);
  assert.deepEqual((await res.json()).shares.map((s) => s.amount), [30, 30, 30]);
});

test('POST /api/split validates input', async () => {
  const res = await fetch(`${base}/api/split`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ total: 0, guests: [] })
  });
  assert.equal(res.status, 400);
});

test('bad JSON gives 400', async () => {
  const res = await fetch(`${base}/api/split`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: '{oops'
  });
  assert.equal(res.status, 400);
});

test('landing page is served', async () => {
  const res = await fetch(`${base}/`);
  assert.equal(res.status, 200);
  assert.match(await res.text(), /SplitShip/);
});

test('unknown route is 404', async () => {
  assert.equal((await fetch(`${base}/nope`)).status, 404);
});

test('POST /api/receipt/parse returns items', async () => {
  const res = await fetch(`${base}/api/receipt/parse`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ text: 'Burger 62.00\nTOTAL 62.00' })
  });
  assert.equal(res.status, 200);
  assert.equal((await res.json()).items[0].price, 62);
});

test('group room flow over HTTP', async () => {
  const post = (u, b) => fetch(`${base}${u}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(b) });
  const room = await (await post('/api/rooms', { items: [{ name: 'Pizza', price: 50 }] })).json();
  const after = await (await post(`/api/rooms/${room.id}/claim`, { name: 'Noya', itemId: 1 })).json();
  assert.equal(after.totals[0].amount, 50);
  assert.equal((await fetch(`${base}/api/rooms/zzzzzzz`)).status, 400);
});

test('POST /api/settle', async () => {
  const res = await fetch(`${base}/api/settle`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ people: ['A', 'B'], expenses: [{ amount: 100, payer: 'A' }] })
  });
  assert.deepEqual((await res.json()).transfers, [{ from: 'B', to: 'A', amount: 50 }]);
});
