'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { parseReceipt } = require('../src/receipt');

test('reads a Hebrew receipt', () => {
  const r = parseReceipt([
    'מסעדת הים', 'טל: 03-5551234', '15/11/2026 20:41',
    'המבורגר 62.00', 'סלט יווני 48.00', '2 x בירה 60.00', 'צ׳יפס ₪25',
    'סה"כ 195.00', 'שירות 12% 23.40', 'אשראי 218.40'
  ].join('\n'));
  assert.deepEqual(r.items.map((i) => [i.name, i.qty, i.price]), [
    ['המבורגר', 1, 62], ['סלט יווני', 1, 48], ['בירה', 2, 30], ['צ׳יפס', 1, 25]
  ]);
  assert.equal(r.detectedTotal, 195);
  assert.equal(r.servicePercent, 12);
  assert.equal(r.matchesTotal, true);
});

test('reads an English receipt', () => {
  const r = parseReceipt('Pasta Arrabbiata 54.90\nLemonade x2 28.00\nSubtotal 82.90\nVAT 12.04\nTOTAL 82.90');
  assert.equal(r.items.length, 2);
  assert.equal(r.items[1].price, 14);
  assert.equal(r.detectedTotal, 82.9);
});

test('rejects empty text', () => {
  assert.throws(() => parseReceipt(''), TypeError);
});
