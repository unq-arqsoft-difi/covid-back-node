const { check, validationResult } = require('express-validator');

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
    return res.status(400).json({
      created: false,
      errors: errors.array().map(e => e.msg),
    });
  }
  return res.status(201).json({ created: true });
};

module.exports.formValidations = formValidations;
module.exports.registry = registry;
