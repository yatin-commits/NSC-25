// middlewares/loggerMiddleware.js
const logger = require('../utils/logger');

const loggerMiddleware = (req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.url}`);
  logger.debug(`Request body: ${JSON.stringify(req.body)}`);
  next();
};

module.exports = loggerMiddleware;
