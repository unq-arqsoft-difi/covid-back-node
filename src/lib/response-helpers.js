const { NOT_FOUND, OK } = require('http-status-codes');

function jsonOK(data) {
  this.type('application/json')
    .status(OK)
    .json(data);
}

function jsonNotFound(message = 'Not Found') {
  this.type('application/json')
    .status(NOT_FOUND)
    .json({
      status: NOT_FOUND,
      message,
    });
}

module.exports = {
  jsonOK,
  jsonNotFound,
};
