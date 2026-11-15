'use strict';

/**
 * Turn the raw text of a scanned restaurant receipt (OCR output, Hebrew or
 * English) into a list of dishes with prices. Lines like totals, VAT,
 * payment and phone numbers are skipped; the receipt total and a service
 * charge are detected when printed.
 */
const SKIP = /(סה["״']?כ|סך\s*הכל|ביניים|מע["״']?מ|לתשלום|תשלום|אשראי|מזומן|עודף|ויזה|כרטיס|טלפון|טל['׳]?|ח\.?פ|עוסק|קופה|שולחן|מלצר|תאריך|שעה|קבלה|חשבונית|מספר|תודה|total|subtotal|vat|tax|cash|card|visa|change|paid|balance|tel|phone|table|server|date|time|receipt|invoice|thank)/i;
const TOTAL = /(סה["״']?כ\s*(לתשלום)?|סך\s*הכל|לתשלום|total|amount\s*due|balance\s*due)/i;
const SUBTOTAL = /(ביניים|subtotal|sub\s*total)/i;
const SERVICE = /(שירות|טיפ|service|tip|gratuity)/i;
// quantity like "2 x", "x2", "2×"; Hebrew OCR often reads a lone x as א
const QTY = /(?<![\d.,])(\d{1,2})\s*(?:[xX×*]|א(?=\s))(?![\d.,])|[xX×*]\s*(\d{1,2})(?![\d.,])/;
const PRICE = /(?:₪|\$|€|ILS|NIS)?\s*(\d{1,3}(?:,\d{3})+|\d+)(?:[.,](\d{1,2}))?\s*(?:₪|ש["״']?ח|ILS|NIS)?/gi;

function numbersIn(line) {
  const out = [];
  for (const m of line.matchAll(PRICE)) {
    const whole = m[1].replace(/,/g, '');
    const value = Number(m[2] ? `${whole}.${m[2].padEnd(2, '0')}` : whole);
    if (Number.isFinite(value)) out.push({ value, dec: Boolean(m[2]), index: m.index, raw: m[0] });
  }
  return out;
}

function cleanName(line) {
  return line
    .replace(QTY, ' ')
    .replace(PRICE, ' ')
    .replace(/[|_=~•·:;"`^<>[\]{}]+/g, ' ')
    .replace(/(^|\s)['׳]+|['׳]+(\s|$)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^[-.,\s]+|[-.,\s]+$/g, '');
}

function parseReceipt(text) {
  if (typeof text !== 'string' || !text.trim()) throw new TypeError('text must be a non empty string');
  const items = [];
  let detectedTotal = null;
  let servicePercent = null;

  for (const rawLine of text.split(/\r?\n/).slice(0, 400)) {
    const line = rawLine.trim();
    if (line.length < 3) continue;
    const nums = numbersIn(line);
    if (!nums.length) continue;

    if (SERVICE.test(line)) {
      const pct = line.match(/(\d{1,2}(?:\.\d)?)\s*%/);
      if (pct) servicePercent = Number(pct[1]);
      continue;
    }
    if (TOTAL.test(line) && !SUBTOTAL.test(line)) {
      const best = Math.max(...nums.map((n) => n.value));
      if (best > 0 && (detectedTotal === null || best > detectedTotal)) detectedTotal = best;
      continue;
    }
    if (SKIP.test(line) || /\d{2}[/.-]\d{2}[/.-]\d{2,4}|\d{1,2}:\d{2}/.test(line)) continue;

    const qtyMatch = line.match(QTY);
    const qty = qtyMatch ? Number(qtyMatch[1] || qtyMatch[2]) : 1;
    const prices = nums.filter((n) => n.dec || n.value >= 5).filter((n) => !(qtyMatch && !n.dec && n.value === qty));
    if (!prices.length) continue;
    const lineTotal = Math.max(...prices.map((n) => n.value));
    if (lineTotal <= 0 || lineTotal > 10000) continue;

    const name = cleanName(line);
    if ((name.match(/[\p{L}]/gu) || []).length < 2) continue;
    const unit = qty > 1 ? Math.round((lineTotal / qty) * 100) / 100 : lineTotal;
    items.push({ name: name.slice(0, 60), qty, price: unit });
  }

  const itemsTotal = Math.round(items.reduce((a, it) => a + it.price * it.qty * 100, 0)) / 100;
  return {
    items,
    itemsTotal,
    detectedTotal,
    servicePercent,
    matchesTotal: detectedTotal !== null && Math.abs(detectedTotal - itemsTotal) < 0.05
  };
}

module.exports = { parseReceipt };
