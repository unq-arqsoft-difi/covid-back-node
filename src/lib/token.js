require('dotenv').config();
const jwt = require('jsonwebtoken');
const { UNAUTHORIZED } = require('http-status-codes');
const ApiError = require('./api-error');

const secret = process.env.ACCESS_TOKEN_SECRET;

const sign = user => jwt.sign(user, secret);

const verify = (req, res, next) => {
  try {
    const token = (req.headers.authorization || '').replace('Bearer', '').trim();
    req.jwt = jwt.verify(token, secret);
    next();
  } catch (error) {
    throw new ApiError('Invalid Token', UNAUTHORIZED);
  }
};

module.exports = { sign, verify };