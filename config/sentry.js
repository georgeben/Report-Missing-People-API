/**
 * Creates and configures a sentry client
 */
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

module.exports = Sentry;
