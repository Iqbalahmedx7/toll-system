const logger = require('../startup/logging');

module.exports = function (err, req, res, next) {
  logger.error(`${err.stack}`);
  res.status(500).send(err.stack);
};
