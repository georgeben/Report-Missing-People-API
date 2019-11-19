const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const routes = require('./routes');
const { logger } = require('./utils');
const morgan = require('morgan');
const cors = require('cors');
const { NODE_ENV } = process.env;

const app = express();

app.use(cors());
if (NODE_ENV === 'production') {
    app.use(morgan('combined'));
} else {
    app.use(morgan('dev'));
}

app.use(methodOverride('X-HTTP-Method-Override'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api', routes);

module.exports = app;