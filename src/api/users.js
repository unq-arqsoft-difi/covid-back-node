const { check, validationResult } = require('express-validator');
const { CREATED, BAD_REQUEST } = require('http-status-codes');
const { sequelize, User } = require('../../db/models');

const emailAlreadyExists = async (email) => {
  const foundedUser = await User.findOne({ where: { email } });
  return foundedUser !== null;
};

const saveUser = (newUser) => {
  sequelize.transaction(t => User.create(newUser, { transaction: t }).then(user => user)).then(result => result)
    .catch(err => err);
};

const formValidations = [
  check('firstName', 'First Name is required').not().isEmpty(),
  check('lastName', 'Last Name is required').not().isEmpty(),
  check('email', 'E-Mail is required').not().isEmpty(),
  check('phone', 'Phone is required').not().isEmpty(),
  check('entity', 'Entity is required').not().isEmpty(),
  check('job', 'Job is required').not().isEmpty(),
  check('place', 'Place is required').not().isEmpty(),
  check('pass', 'Pass is required').not().isEmpty(),
];

const registry = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(BAD_REQUEST).json({
      created: false,
      errors: errors.array().map(e => e.msg),
    });
  }
  if (await emailAlreadyExists(req.body.email)) {
    res.status(BAD_REQUEST).json({
      created: false,
      errors: ['E-Mail address already exists'],
    });
  } else {
    const {
      firstName, lastName, email, phone, entity, job, place, pass,
    } = req.body;
    const newUser = {
      firstName, lastName, email, phone, entity, job, place, pass,
    };
    await saveUser(newUser);
    res.status(CREATED).json({ created: true });
  }
  return res;
};

module.exports = { formValidations, registry };
