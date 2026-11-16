'use strict';
const { allocate, ValidationError } = require('./split');

/**
 * Trip / flat expenses: several people pay for different things.
 * Each expense is split between its people (everyone by default).
 * Returns each person's balance and the fewest transfers that settle it.
 */
function settle({ people, expenses, currency = 'ILS' } = {}) {
  if (!Array.isArray(people) || people.length < 2) throw new ValidationError('people must have at least 2 names');
  if (people.length > 100) throw new ValidationError('too many people (max 100)');
  const names = people.map((p, i) => {
    if (typeof p !== 'string' || !p.trim()) throw new ValidationError(`person #${i + 1} needs a name`);
    return p.trim();
  });
  if (new Set(names).size !== names.length) throw new ValidationError('names must be unique');
  if (!Array.isArray(expenses) || expenses.length === 0) throw new ValidationError('expenses must be a non empty array');
  if (expenses.length > 500) throw new ValidationError('too many expenses (max 500)');

  const find = (p, label) => {
    const i = typeof p === 'number' ? p : names.indexOf(String(p).trim());
    if (!Number.isInteger(i) || i < 0 || i >= names.length) throw new ValidationError(`"${label}" is linked to an unknown person "${p}"`);
    return i;
  };
  const paid = names.map(() => 0);
  const owe = names.map(() => 0);
  let total = 0;
  expenses.forEach((e, n) => {
    const label = (e && typeof e.title === 'string' && e.title.trim()) || `expense #${n + 1}`;
    if (typeof e?.amount !== 'number' || !Number.isFinite(e.amount) || e.amount <= 0) throw new ValidationError(`"${label}" needs a positive amount`);
    const cents = Math.round(e.amount * 100);
    paid[find(e.payer, label)] += cents;
    const idx = [...new Set((Array.isArray(e.people) && e.people.length ? e.people : names).map((p) => find(p, label)))];
    allocate(cents, idx.map(() => 1)).forEach((c, k) => { owe[idx[k]] += c; });
    total += cents;
  });

  const net = names.map((_, i) => paid[i] - owe[i]);
  const cred = net.map((v, i) => ({ i, v })).filter((x) => x.v > 0).sort((a, b) => b.v - a.v);
  const debt = net.map((v, i) => ({ i, v: -v })).filter((x) => x.v > 0).sort((a, b) => b.v - a.v);
  const transfers = [];
  let c = 0;
  let d = 0;
  while (c < cred.length && d < debt.length) {
    const amt = Math.min(cred[c].v, debt[d].v);
    transfers.push({ from: names[debt[d].i], to: names[cred[c].i], amount: amt / 100 });
    cred[c].v -= amt; debt[d].v -= amt;
    if (!cred[c].v) c += 1;
    if (!debt[d].v) d += 1;
  }
  return {
    currency,
    total: total / 100,
    balances: names.map((name, i) => ({ name, paid: paid[i] / 100, share: owe[i] / 100, net: net[i] / 100 })),
    transfers
  };
}

module.exports = { settle };
