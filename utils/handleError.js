/**
 * Error handler for worker process
 */
const Sentry = require('../config/sentry');
const logger = require('./logger');

/**
 * Logs the error and reports it to sentry
 * @param {Object} error - The error
 */
function handleError(error) {
  logger.log('error', 'An error occurred ', error);
  Sentry.captureException(error);
}

module.exports = handleError;
