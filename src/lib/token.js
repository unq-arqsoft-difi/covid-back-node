require('dotenv').config();
const jwt = require('jsonwebtoken');
const { UnauthorizedResponse } = require('./api-error');

const secret = process.env.ACCESS_TOKEN_SECRET;

const sign = user => jwt.sign(user, secret);

const verify = (req, res, next) => {
  try {
    const token = (req.headers.authorization || '').replace('Bearer', '').trim();
    req.jwt = jwt.verify(token, secret);
    next();
  } catch (error) {
    throw new UnauthorizedResponse('Invalid Token');
  }
};

const verifyAdmin = (req, res, next) => {
  try {
    const token = (req.headers.authorization || '').replace('Bearer', '').trim();
    req.jwt = jwt.verify(token, secret);
    if (!req.jwt.admin) throw new Error();
    next();
  } catch (error) {
    throw new UnauthorizedResponse('Invalid Token');
  }
};

module.exports = { sign, verify, verifyAdmin };
