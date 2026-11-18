'use strict';
const path = require('node:path');
const express = require('express');
const { splitBill, ValidationError } = require('./split');
const { parseReceipt } = require('./receipt');
const { settle } = require('./settle');
const rooms = require('./rooms');
const pkg = require('../package.json');

function currentCommit() {
  const sha = process.env.GIT_SHA;
  if (sha && sha !== 'local') return sha;
  return process.env.RAILWAY_GIT_COMMIT_SHA || process.env.RENDER_GIT_COMMIT || 'local';
}

/**
 * Tiny in-memory rate limiter (no extra dependency): each IP gets `max`
 * POST requests per `windowMs`. The live calculator posts on every keystroke,
 * so the limit is generous; it only stops scripts from flooding the API.
 */
function rateLimit({ windowMs = 60_000, max = 300 } = {}) {
  const hits = new Map();
  return (req, res, next) => {
    if (req.method !== 'POST') return next();
    const now = Date.now();
    const ip = req.ip || req.socket?.remoteAddress || 'unknown';
    const h = hits.get(ip);
    if (!h || now - h.start > windowMs) {
      if (hits.size > 10_000) hits.clear();
      hits.set(ip, { start: now, count: 1 });
      return next();
    }
    if (++h.count > max) {
      res.setHeader('Retry-After', String(Math.ceil((h.start + windowMs - now) / 1000)));
      return res.status(429).json({ error: 'too many requests, slow down a little' });
    }
    next();
  };
}

function securityHeaders(_req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(self), microphone=(), geolocation=()');
  next();
}

function createApp({ limit } = {}) {
  const app = express();
  const startedAt = Date.now();

  app.disable('x-powered-by');
  app.set('trust proxy', 1);
  app.use(securityHeaders);
  app.use(express.json({ limit: '100kb' }));
  app.use('/api', rateLimit(limit));
  app.use(express.static(path.join(__dirname, '..', 'public'), {
    setHeaders(res, file) {
      // the service worker and the page must always be fresh, the rest may be cached for an hour
      res.setHeader('Cache-Control', /(sw\.js|\.html|\.webmanifest)$/.test(file) ? 'no-cache' : 'public, max-age=3600');
    }
  }));

  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      version: pkg.version,
      commit: currentCommit(),
      uptimeSeconds: Math.round((Date.now() - startedAt) / 1000)
    });
  });

  app.post('/api/split', (req, res) => {
    try {
      res.json(splitBill(req.body));
    } catch (err) {
      if (err instanceof ValidationError) return res.status(400).json({ error: err.message });
      throw err;
    }
  });

  app.post('/api/receipt/parse', (req, res) => {
    try {
      res.json(parseReceipt(req.body?.text));
    } catch (err) {
      if (err instanceof TypeError) return res.status(400).json({ error: err.message });
      throw err;
    }
  });

  const handle = (fn) => (req, res) => {
    try {
      res.json(fn(req));
    } catch (err) {
      if (err instanceof ValidationError) return res.status(400).json({ error: err.message });
      throw err;
    }
  };
  const room = (req) => {
    const r = rooms.getRoom(req.params.id);
    if (!r) throw new ValidationError('this link has expired or does not exist');
    return r;
  };

  app.post('/api/settle', handle((req) => settle(req.body)));
  app.post('/api/rooms', handle((req) => rooms.createRoom(req.body)));
  app.get('/api/rooms/:id', handle((req) => rooms.view(room(req))));
  app.post('/api/rooms/:id/join', handle((req) => {
    const r = room(req); rooms.join(r, req.body?.name); rooms.touch(r); return rooms.view(r);
  }));
  app.post('/api/rooms/:id/claim', handle((req) => {
    const r = room(req); rooms.claim(r, req.body); return rooms.view(r);
  }));

  app.use((_req, res) => res.status(404).json({ error: 'not found' }));

  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'invalid JSON' });
    console.error(err);
    res.status(500).json({ error: 'internal error' });
  });

  return app;
}

module.exports = { createApp };
