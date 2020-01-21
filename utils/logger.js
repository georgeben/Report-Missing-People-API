/**
 * Creates and configures a logger
 */
const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.Console(),
  ],
});

module.exports = logger;
