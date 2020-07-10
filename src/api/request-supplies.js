const { check, validationResult } = require('express-validator');
const { CREATED, BAD_REQUEST } = require('http-status-codes');
const ApiError = require('../lib/api-error');
const {
  Area,
  RequestSupply,
  Supply,
  User,
} = require('../../db/models');

// ----- Private -----

const checkValidationsMiddleware = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError('Validation Errors', BAD_REQUEST, errors.array().map(e => e.msg));
  }
};

const existsIn = model => async (value) => {
  if (!value) return Promise.reject();
  const count = await model.count({ where: { id: value } });
  return count > 0 ? Promise.resolve() : Promise.reject();
};

// ----- Public -----

const requestValidations = [
  check('areaId', 'Invalid Area ID').custom(existsIn(Area)),
  check('supplyId', 'Invalid Supply ID').custom(existsIn(Supply)),
];

/**
 * GET /request-supplies
 */
const getRequestSupplies = async (req, res) => {
  const { status } = req.query;
  const user = await User.findOne({ where: { email: req.jwt.email } });

  const where = { userId: user.id };
  if (status) where.status = status;
  const requestSupplies = await RequestSupply.findAll({ where });

  return res.jsonOK(requestSupplies);
};

/**
 * GET /request-supplies/:id
 */
const getRequestSupply = async (req, res) => {
  const { id } = req.params;
  const { status } = req.query;
  const user = await User.findOne({ where: { email: req.jwt.email } });

  const where = { id, userId: user.id };
  if (status) where.status = status;
  const requestSupply = await RequestSupply.findOne({ where });
  if (!requestSupply) throw new ApiError('Request Supply not exists', BAD_REQUEST);

  return res.jsonOK(requestSupply);
};

/**
 * POST /request-supplies
 */
const createRequestSupply = async (req, res) => {
  checkValidationsMiddleware(req);

  const user = await User.findOne({ where: { email: req.jwt.email } });
  const { amount, supplyId, areaId } = req.body;

  try {
    const request = await RequestSupply.create({
      userId: user.id,
      supplyId,
      areaId,
      amount,
      status: 'Pending',
    });
    return res.status(CREATED).json({ created: true, request });
  } catch (error) {
    throw new ApiError('Error creating request Supply', BAD_REQUEST, [error.toString()]);
  }
};

module.exports = {
  createRequestSupply,
  getRequestSupplies,
  getRequestSupply,
  requestValidations,
};
