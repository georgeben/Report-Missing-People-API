const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const methodOverride = require('method-override');
const morgan = require('morgan');
const passport = require('passport');
const Sentry = require('@sentry/node');
const routes = require('./routes');
const { logFormat } = require('./config')();
const { jwtParser } = require('./middlewares');
const { logger } = require('./utils');
require('./utils/newsletter-cron');

const { NODE_ENV } = process.env;

const app = express();
app.use(helmet());
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.APP_ENV,
});
app.use(Sentry.Handlers.requestHandler());

// TODO: Add domain whitelist
app.use(cors());
app.use(compression());

app.use(morgan(logFormat));

app.use(passport.initialize());

app.use(methodOverride('X-HTTP-Method-Override'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(jwtParser);

app.use('/api', routes);

app.use(Sentry.Handlers.errorHandler());

app.use((req, res, next) => {
  return res.status(404).json({
    error: 'The resource you are requesting for does not exist',
  });
});

app.use((error, req, res, next) => {
  logger.log('error', 'An error occurred ', error);
  if (error.oauthError.statusCode === 400) {
    return res.status(400).json({
      error: 'Invalid OAuth access token',
    });
  }
  Sentry.captureException(error);
  if (NODE_ENV !== 'production') {
    return res.status(error.status || 500).json({
      message: 'Something bad happened',
      error: error.message,
      stack: error.stack,
    });
  }
  return res.status(error.status || 500).json({
    error: 'Something bad happened',
  });
});

module.exports = app;
