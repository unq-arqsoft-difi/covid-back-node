/* eslint-disable max-classes-per-file */
const {
  BAD_REQUEST,
  FORBIDDEN,
  UNAUTHORIZED,
} = require('http-status-codes');

class ApiError extends Error {
  constructor(message, status = BAD_REQUEST, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

class BadRequestResponse extends ApiError {
  constructor(message, errors = []) {
    super(message, BAD_REQUEST, errors);
  }
}

class ForbiddenResponse extends ApiError {
  constructor(message, errors = []) {
    super(message, FORBIDDEN, errors);
  }
}

class UnauthorizedResponse extends ApiError {
  constructor(message, errors = []) {
    super(message, UNAUTHORIZED, errors);
  }
}

module.exports = {
  ApiError,
  BadRequestResponse,
  ForbiddenResponse,
  UnauthorizedResponse,
};
