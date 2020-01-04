const Sentry = require('../config/sentry');
const logger = require('./logger');

function handleError(error) {
  logger.log('error', 'An error occurred ', error);
  Sentry.captureException(error);
}

module.exports = handleError;
