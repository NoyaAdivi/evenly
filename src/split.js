'use strict';

/**
 * Split a bill between guests, exactly to the agora/cent.
 * mode "equal"  -> everyone pays the same
 * mode "nights" -> each guest pays by the number of nights they stayed
 * Remainders are given out with the largest remainder method,
 * so the shares always add up to the total.
 */
function splitBill({ total, guests, mode = 'equal', currency = 'ILS' } = {}) {
  if (typeof total !== 'number' || !Number.isFinite(total) || total <= 0) {
    throw new ValidationError('total must be a positive number');
  }
  if (!Array.isArray(guests) || guests.length === 0) {
    throw new ValidationError('guests must be a non empty array');
  }
  if (guests.length > 100) throw new ValidationError('too many guests (max 100)');
  if (!['equal', 'nights'].includes(mode)) {
    throw new ValidationError('mode must be "equal" or "nights"');
  }

  const weights = guests.map((g, i) => {
    if (!g || typeof g.name !== 'string' || !g.name.trim()) {
      throw new ValidationError(`guest #${i + 1} needs a name`);
    }
    if (mode === 'equal') return 1;
    if (!Number.isInteger(g.nights) || g.nights <= 0) {
      throw new ValidationError(`guest "${g.name}" needs a positive whole number of nights`);
    }
    return g.nights;
  });

  const totalCents = Math.round(total * 100);
  const sum = weights.reduce((a, b) => a + b, 0);
  const raw = weights.map((w) => (totalCents * w) / sum);
  const cents = raw.map(Math.floor);
  let left = totalCents - cents.reduce((a, b) => a + b, 0);

  raw
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac || a.i - b.i)
    .forEach(({ i }) => {
      if (left > 0) { cents[i] += 1; left -= 1; }
    });

  return {
    currency,
    mode,
    total: totalCents / 100,
    shares: guests.map((g, i) => ({ name: g.name.trim(), amount: cents[i] / 100 }))
  };
}

class ValidationError extends Error {}

module.exports = { splitBill, ValidationError };
