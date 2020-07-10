const { check, validationResult } = require('express-validator');
const { CREATED } = require('http-status-codes');
const {
  Institution,
  Province,
  sequelize,
  Town,
  User,
} = require('../../db/models');
const { BadRequestResponse } = require('../lib/api-error');

// ----- Private -----

const emailNotRegistered = async (value) => {
  if (!value) return Promise.resolve();
  const user = await User.count({ where: { email: value } });
  return user > 0 ? Promise.reject() : Promise.resolve();
};

const existsIn = model => async (value) => {
  if (!value) return Promise.reject();
  const count = await model.count({ where: { id: value } });
  return count > 0 ? Promise.resolve() : Promise.reject();
};

// ----- Public -----

const formValidations = [
  check('firstName', 'First Name is required').not().isEmpty(),
  check('lastName', 'Last Name is required').not().isEmpty(),
  check('email', 'E-Mail is required').not().isEmpty(),
  check('phone', 'Phone is required').not().isEmpty(),
  check('job', 'Job is required').not().isEmpty(),
  check('pass', 'Pass is required').not().isEmpty(),
  check('institutionId', 'Invalid Institution ID').custom(existsIn(Institution)),
  check('provinceId', 'Invalid Province ID').custom(existsIn(Province)),
  check('townId', 'Invalid Town ID').custom(existsIn(Town)),
  check('email', 'E-Mail address already exists').custom(emailNotRegistered),
];

const registry = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new BadRequestResponse('User not created', errors.array().map(e => e.msg));
  }

  try {
    const request = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      institutionId: req.body.institutionId,
      job: req.body.job,
      provinceId: req.body.provinceId,
      townId: req.body.townId,
      pass: req.body.pass,
      admin: false,
    });

    return res.status(CREATED).json({ created: true, request });
  } catch (error) {
    throw new BadRequestResponse('User Registration Error', [error.toString()]);
  }
};

module.exports = { formValidations, registry };
