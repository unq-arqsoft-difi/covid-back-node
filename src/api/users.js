const { check, validationResult } = require('express-validator');
const { CREATED, BAD_REQUEST } = require('http-status-codes');
const { sequelize, User } = require('../../db/models');

// ----- Private -----

const saveUser = newUser => sequelize
  .transaction(transaction => User.create(newUser, { transaction }).then(user => user))
  .then(result => result)
  .catch(err => err);

// ----- Public -----

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

  const user = await User.findOne({ where: { email: req.body.email } });
  if (user) {
    return res.status(BAD_REQUEST).json({
      created: false,
      errors: ['E-Mail address already exists'],
    });
  }

  await saveUser({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    entity: req.body.entity,
    job: req.body.job,
    place: req.body.place,
    pass: req.body.pass,
  });

  return res.status(CREATED).json({ created: true });
};

module.exports = { formValidations, registry };
