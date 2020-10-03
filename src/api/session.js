require('dotenv').config();
const { check, validationResult } = require('express-validator');
const { BAD_REQUEST } = require('http-status-codes').StatusCodes;
const token = require('../lib/token');
const { User } = require('../../db/models');

// ----- Private -----

const authUser = async (email, pass) => User.findOne({ where: { email, pass } });

// ----- Public -----

const formValidations = [
  check('email', 'E-Mail is required').not().isEmpty(),
  check('pass', 'Pass is required').not().isEmpty(),
];

const create = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(BAD_REQUEST).json({
      created: false,
      errors: errors.array().map(e => e.msg),
    });
  }

  const { email, pass } = req.body;
  const user = await authUser(email, pass);
  if (user) {
    const jwt = token.sign({ email, admin: user.admin });
    res.jsonOK({
      email,
      name: `${user.firstName} ${user.lastName}`,
      job: `${user.job}`,
      admin: user.admin,
      token: jwt,
    });
  } else {
    res.status(BAD_REQUEST).json({
      token: false,
      errors: ['Invalid email or password'],
    });
  }
  return res;
};

module.exports = { create, formValidations };
