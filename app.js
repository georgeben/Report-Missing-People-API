const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const passport = require('passport');
const Sentry = require('@sentry/node');
const morgan = require('morgan');
const cors = require('cors');
const routes = require('./routes');
const { jwtParser } = require('./middlewares');
const { logger } = require('./utils');
require('./utils/newsletter-cron');

const { NODE_ENV } = process.env;

const app = express();
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
app.use(Sentry.Handlers.requestHandler());

// TODO: Add domain whitelist
app.use(cors());
if (NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

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
  logger.log('error', 'An error occurred', error);
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
