const apiExpressExporter = require('api-express-exporter');
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const {
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require('http-status-codes').StatusCodes;
const paginate = require('express-paginate');
const logger = require('./lib/logger');
const { morganAccess, morganAccessMs } = require('./lib/morgan');
const { jsonOK, jsonNotFound } = require('./lib/response-helpers');

const app = express();

// Middleware
app.use(cors());
app.use(
  morgan('combined', {
    stream: { write: message => morganAccess.info(message) },
  }),
);
app.use(
  morgan('short', {
    stream: { write: message => morganAccessMs.info(message) },
  }),
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/json' }));
app.use((req, res, next) => {
  // Response helpers
  res.jsonOK = jsonOK;
  res.jsonNotFound = jsonNotFound;
  next();
});
app.use(paginate.middleware(10, 50));

if (process.env.NODE_ENV !== 'test') {
  // api-express-exporter: metrics to prometheus
  app.use(apiExpressExporter({ host: '0.0.0.0', port: 9991 }));
}

// Rutas
app.use('/', require('./router'));

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
  const status = error.status || INTERNAL_SERVER_ERROR;
  const message = error.message || 'Ups, something is wrong...';
  if (status >= 500) logger.error(error);

  const response = { status, message };
  if (error.errors) response.errors = error.errors;
  res.status(status);
  res.json(response);
});

module.exports = app;
