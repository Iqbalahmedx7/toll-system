const express = require('express');
const app = express();
let server = null;

const logger = require('./logging');
const PORT = process.env.PORT || 8080;

server = app.listen(PORT, () => {
  logger.info(`Listening at http://localhost:${PORT}`);
});

module.exports = {
  app: app,
  server: server,
};
