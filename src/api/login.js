require('dotenv').config();
const { check, validationResult } = require('express-validator');
const { BAD_REQUEST, NOT_FOUND } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const { User } = require('../../db/models');

const loginFormValidations = [
  check('email', 'E-Mail is required').not().isEmpty(),
  check('pass', 'Pass is required').not().isEmpty(),
];
const generateAccessToken = user => jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

const isValidCredentials = async (email, pass) => {
  const foundedUser = await User.findOne({ where: { email, pass } });
  return foundedUser !== null;
};

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(NOT_FOUND).json({
      created: false,
      errors: errors.array().map(e => e.msg),
    });
  }
  const { email, pass } = req.body;
  if (await isValidCredentials(email, pass)) {
    const token = generateAccessToken({ email });
    res.jsonOK({ token });
  } else {
    res.status(BAD_REQUEST).json({
      token: false,
      errors: ['Invalid email or password'],
    });
  }
  return res;
};

module.exports = { login, loginFormValidations };
