/* eslint-disable no-multi-spaces */
require('dotenv').config();

const express  = require('express');
const session  = require('./api/session');
const supplies = require('./api/request-supplies');
const support  = require('./api/support');
const token    = require('./lib/token');
const users    = require('./api/users');
const admin    = require('./api/admin');
const { ForbiddenResponse } = require('./lib/api-error');

const router = express.Router();

const handling = callback => async (req, res, next) => {
  try {
    return await callback(req, res, next);
  } catch (error) {
    return next(error);
  }
};

// router.METHOD('path', [middleware,] callback)

router.post('/session', session.formValidations, handling(session.create));
router.post('/users',   users.formValidations,   handling(users.registry));

router.post(
  '/request-supplies',
  [token.verify, supplies.requestValidations],
  handling(supplies.createRequestSupply),
);
router.get(
  '/request-supplies',
  token.verify,
  handling(supplies.getRequestSupplies),
);
router.get(
  '/request-supplies/:id',
  token.verify,
  handling(supplies.getRequestSupply),
);
router.delete(
  '/request-supplies/:id',
  token.verify,
  handling(supplies.cancelRequestSupply),
);
router.patch(
  '/request-supplies/:id',
  token.verifyAdmin,
  handling(admin.upgradeRequestSupplyStatus),
);

router.get('/support/areas',               handling(support.allAreas));
router.get('/support/institutions',        handling(support.allInstitutions));
router.get('/support/provinces',           handling(support.allProvinces));
router.get('/support/provinces/:id',       handling(support.idProvince));
router.get('/support/provinces/:id/towns', handling(support.idProvinceTowns));
router.get('/support/supplies',            handling(support.allSupplies));
router.get('/support/providers',           handling(support.allProviders));

// for testing connection only
router.get('/test', (req, res) => res.json({ msg: 'ok' }));
router.get('/test/error', handling(() => {
  throw new ForbiddenResponse('fuck off', ['error 1', 'error 2']);
}));
router.get('/test/token', token.verify, (req, res) => res.json({ info: req.jwt }));

module.exports = router;
