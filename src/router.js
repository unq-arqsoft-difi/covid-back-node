/* eslint-disable no-multi-spaces */
const express = require('express');
const login   = require('./api/login');
const support = require('./api/support');
const users   = require('./api/users');

const router = express.Router();

const handling = callback => async (req, res, next) => {
  try {
    return callback(req, res, next);
  } catch (error) {
    return next(error);
  }
};

// router.METHOD('path', [middleware,] callback)
router.post('/login', login.loginFormValidations, handling(login.login));
router.post('/users', users.formValidations,      handling(users.registry));
router.get('/support/areas',                      handling(support.allAreas));
router.get('/support/institutions',               handling(support.allInstitutions));
router.get('/support/provinces',                  handling(support.allProvinces));
router.get('/support/provinces/:id',              handling(support.idProvince));
router.get('/support/provinces/:id/towns',        handling(support.idProvinceTowns));
router.get('/support/supplies',                   handling(support.allSupplies));

// for testing connection only
router.get('/test', (req, res) => res.json({ msg: 'ok' }));

module.exports = router;
