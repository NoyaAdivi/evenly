'use strict';
const { createApp } = require('./app');

const port = Number(process.env.PORT) || 3000;
const server = createApp().listen(port, () => {
  console.log(`SplitShip is sailing on http://localhost:${port}`);
});

for (const signal of ['SIGTERM', 'SIGINT']) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
