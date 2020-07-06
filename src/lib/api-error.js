const { BAD_REQUEST } = require('http-status-codes');

class ApiError extends Error {
  constructor(message, status = BAD_REQUEST, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

module.exports = ApiError;
