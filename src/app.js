'use strict';
const path = require('node:path');
const express = require('express');
const { splitBill, ValidationError } = require('./split');
const { parseReceipt } = require('./receipt');
const pkg =require('../package.json');

function currentCommit() {
  const sha = process.env.GIT_SHA;
  if (sha && sha !== 'local') return sha;
  return process.env.RENDER_GIT_COMMIT || 'local';
}

function createApp() {
  const app = express();
  const startedAt = Date.now();

  app.disable('x-powered-by');
  app.use(express.json({ limit: '100kb' }));
  app.use(express.static(path.join(__dirname, '..', 'public')));

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
