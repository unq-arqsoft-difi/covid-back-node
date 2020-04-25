var cors = require('cors')
const express = require('express');
const bodyParser = require('body-parser');
const { OK } = require('http-status-codes');

const app = express();

function jsonOK(data) { this.type('application/json').status(OK).json(data); }

// Middleware
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/json' }));
app.use((req, res, next) => {
  // Response helpers
  res.jsonOK = jsonOK;
  next();
});

// Rutas
app.use('/hi', require('./api/hi'));

// Error Handling
app.use((req, res, next) => {
  const error = new Error('Nof Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
