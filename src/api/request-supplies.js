const { check, validationResult } = require('express-validator');
const { CREATED } = require('http-status-codes');
const { BadRequestResponse } = require('../lib/api-error');
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
    throw new BadRequestResponse('Validation Errors', errors.array().map(e => e.msg));
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
  if (!requestSupply) throw new BadRequestResponse('Request Supply not exists');

  return res.jsonOK(requestSupply);
};

/**
 * DELETE /request-supplies/:id
 */
const cancelRequestSupply = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ where: { email: req.jwt.email } });

  const requestSupply = await RequestSupply.findOne({ where: { id, userId: user.id } });
  if (!requestSupply) throw new BadRequestResponse('Request Supply not exists');

  requestSupply.status = 'Canceled';
  await requestSupply.save();

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
    throw new BadRequestResponse('Error creating request Supply', [error.toString()]);
  }
};

module.exports = {
  cancelRequestSupply,
  createRequestSupply,
  getRequestSupplies,
  getRequestSupply,
  requestValidations,
};
