const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const passport = require('passport');
const morgan = require('morgan');
const cors = require('cors');
const routes = require('./routes');
// const { logger } = require('./utils');
const { NODE_ENV } = process.env;

const app = express();

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

app.use('/api', routes);

module.exports = app;
