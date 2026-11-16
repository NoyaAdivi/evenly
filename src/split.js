'use strict';

/**
 * Split a bill between guests, exactly to the agora/cent.
 * mode "equal"  -> everyone pays the same
 * mode "nights" -> each guest pays by the number of nights they stayed (hotel)
 * mode "items"  -> each guest pays for the dishes they had (restaurant);
 *                  a dish shared by several people is split between them,
 *                  a dish with no people is shared by everyone
 * mode "percent" -> each guest pays their own percent (must add up to 100)
 * mode "shares"  -> weighted, e.g. a couple counts 2 and a kid 0.5
 * mode "exact"   -> some guests pay a fixed amount, the rest is split equally
 * mode "pools"   -> categories (food, drinks, taxi...) each split only between
 *                  the people in it, e.g. drinks only between the drinkers
 * treat: names (or indexes) of people who are treated, e.g. a birthday; their
 *        share is split equally between everyone else.
 * roundTo: round every share up (0.1, 1, 5 or 10) so nobody needs coins;
 *          the extra is added to the tip.
 * tipPercent adds a tip (or service charge), split by what each person ate.
 * Remainders are given out with the largest remainder method,
 * so the shares always add up to the total.
 */
const MODES = ['equal', 'nights', 'items', 'percent', 'shares', 'exact', 'pools'];

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
    const unique = resolvePeople(it.people, names, label);
    const cents = Math.round(it.price * qty * 100);
    allocate(cents, unique.map(() => 1)).forEach((c, k) => {
      sub[unique[k]] += c;
      lines[unique[k]].push({ name: label, amount: c / 100, sharedWith: unique.length });
    });
  });
  return { sub, lines };
}

const num = (v) => typeof v === 'number' && Number.isFinite(v);

function resolvePeople(people, names, label) {
  const list = Array.isArray(people) && people.length ? people : names;
  const idx = list.map((p) => {
    const i = typeof p === 'number' ? p : names.indexOf(String(p).trim());
    if (!Number.isInteger(i) || i < 0 || i >= names.length) {
      throw new ValidationError(`"${label}" is linked to an unknown guest "${p}"`);
    }
    return i;
  });
  return [...new Set(idx)];
}

function poolSubtotals(pools, guests) {
  if (!Array.isArray(pools) || pools.length === 0) throw new ValidationError('pools mode needs a non empty pools array');
  if (pools.length > 50) throw new ValidationError('too many pools (max 50)');
  const names = guests.map((g) => g.name.trim());
  const sub = names.map(() => 0);
  const lines = names.map(() => []);
  pools.forEach((pl, n) => {
    const label = (pl && typeof pl.name === 'string' && pl.name.trim()) || `pool #${n + 1}`;
    if (!num(pl?.amount) || pl.amount < 0) throw new ValidationError(`"${label}" needs an amount of 0 or more`);
    const idx = resolvePeople(pl.people, names, label);
    allocate(Math.round(pl.amount * 100), idx.map(() => 1)).forEach((c, k) => {
      sub[idx[k]] += c;
      lines[idx[k]].push({ name: label, amount: c / 100, sharedWith: idx.length });
    });
  });
  return { sub, lines };
}

function weightedSubtotals(mode, totalCents, guests) {
  if (mode === 'exact') {
    const fixed = guests.map((g) => (g.amount === undefined || g.amount === null || g.amount === '' ? null : g.amount));
    fixed.forEach((a, i) => {
      if (a !== null && (!num(a) || a < 0)) throw new ValidationError(`guest "${guests[i].name}" needs an amount of 0 or more`);
    });
    const fixedCents = fixed.map((a) => (a === null ? 0 : Math.round(a * 100)));
    const used = fixedCents.reduce((a, b) => a + b, 0);
    if (used > totalCents) throw new ValidationError('the fixed amounts are more than the total');
    const rest = guests.map((_, i) => (fixed[i] === null ? 1 : 0));
    if (!rest.some(Boolean) && used !== totalCents) throw new ValidationError('the amounts must add up to the total');
    const extra = allocate(totalCents - used, rest);
    return fixedCents.map((c, i) => c + extra[i]);
  }
  const weights = guests.map((g) => {
    if (mode === 'equal') return 1;
    if (mode === 'nights') {
      if (!Number.isInteger(g.nights) || g.nights <= 0) {
        throw new ValidationError(`guest "${g.name}" needs a positive whole number of nights`);
      }
      return g.nights;
    }
    const v = mode === 'percent' ? g.percent : g.shares;
    if (!num(v) || v < 0) throw new ValidationError(`guest "${g.name}" needs a ${mode === 'percent' ? 'percent' : 'share'} of 0 or more`);
    return Math.round(v * 1000);
  });
  if (mode === 'percent') {
    const sum = weights.reduce((a, b) => a + b, 0);
    if (Math.abs(sum - 100000) > 10) throw new ValidationError('percents must add up to 100');
  }
  if (!weights.some((w) => w > 0)) throw new ValidationError('at least one guest needs a share above 0');
  return allocate(totalCents, weights);
}

function splitBill({ total, guests, mode = 'equal', currency = 'ILS', items, pools, tipPercent = 0, treat = [], roundTo = 0 } = {}) {
  if (!MODES.includes(mode)) throw new ValidationError(`mode must be one of: ${MODES.join(', ')}`);
  checkGuests(guests);
  if (typeof tipPercent !== 'number' || !Number.isFinite(tipPercent) || tipPercent < 0 || tipPercent > 100) {
    throw new ValidationError('tipPercent must be between 0 and 100');
  }

  let sub;
  let lines = null;
  if (mode === 'items') {
    ({ sub, lines } = itemSubtotals(items, guests));
  } else if (mode === 'pools') {
    ({ sub, lines } = poolSubtotals(pools, guests));
  } else {
    if (!num(total) || total <= 0) throw new ValidationError('total must be a positive number');
    sub = weightedSubtotals(mode, Math.round(total * 100), guests);
  }

  const subtotal = sub.reduce((a, b) => a + b, 0);
  if (subtotal <= 0) throw new ValidationError('the bill adds up to 0');
  const tipCents = Math.round((subtotal * tipPercent) / 100);
  const tips = allocate(tipCents, sub);

  const names = guests.map((g) => g.name.trim());
  const pay = sub.map((c, i) => c + tips[i]);
  const covered = names.map(() => 0);

  if (!Array.isArray(treat)) throw new ValidationError('treat must be an array');
  const treated = new Set(treat.map((p) => {
    const i = typeof p === 'number' ? p : names.indexOf(String(p).trim());
    if (!Number.isInteger(i) || i < 0 || i >= names.length) throw new ValidationError(`cannot treat unknown guest "${p}"`);
    return i;
  }));
  if (treated.size && treated.size >= names.length) throw new ValidationError('someone has to pay, not everyone can be treated');
  if (treated.size) {
    const gift = [...treated].reduce((a, i) => a + pay[i], 0);
    treated.forEach((i) => { pay[i] = 0; });
    allocate(gift, names.map((_, i) => (treated.has(i) ? 0 : 1))).forEach((c, i) => { pay[i] += c; covered[i] = c; });
  }

  let extra = 0;
  if (roundTo) {
    if (![0.1, 1, 5, 10].includes(roundTo)) throw new ValidationError('roundTo must be 0.1, 1, 5 or 10');
    const step = Math.round(roundTo * 100);
    pay.forEach((c, i) => { if (c) { const r = Math.ceil(c / step) * step; extra += r - c; pay[i] = r; } });
  }

  return {
    currency,
    mode,
    subtotal: subtotal / 100,
    tipPercent,
    tip: (tipCents + extra) / 100,
    ...(extra ? { roundingExtra: extra / 100 } : {}),
    total: (subtotal + tipCents + extra) / 100,
    shares: guests.map((g, i) => ({
      name: names[i],
      amount: pay[i] / 100,
      ...(tipCents ? { tip: tips[i] / 100 } : {}),
      ...(treated.has(i) ? { treated: true } : {}),
      ...(covered[i] ? { covers: covered[i] / 100 } : {}),
      ...(lines ? { items: lines[i] } : {})
    }))
  };
}

module.exports = { splitBill, allocate, ValidationError, MODES };
