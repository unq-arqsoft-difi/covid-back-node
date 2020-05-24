const cors       = require('cors');
const express    = require('express');
const bodyParser = require('body-parser');
const logger     = require('winston-ready');
const { NOT_FOUND, OK, INTERNAL_SERVER_ERROR } = require('http-status-codes');

const app = express();

function jsonOK(data) { this.type('application/json').status(OK).json(data); }

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/json' }));
app.use((req, res, next) => {
  // Response helpers
  res.jsonOK = jsonOK;
  next();
});

// Rutas
app.use('/users', require('./api/users'));
app.use('/login', require('./api/login'));

// Not Found Handling
app.use((req, res, next) => {
  next({
    message: `${req.method} ${req.path} Not Found`,
    status: NOT_FOUND,
  });
});

// Must be the last middleware to work properly
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  logger.info(error);
  const status = error.status || INTERNAL_SERVER_ERROR;
  const message = error.message || 'Ups, something is wrong...';
  res.status(status);
  res.json({
    error: { status, message },
  });
});

module.exports = app;
