const { check, validationResult } = require('express-validator');
const { CREATED } = require('http-status-codes').StatusCodes;
const { BadRequestResponse } = require('../lib/api-error');
const { Area, RequestSupply, Supply, User } = require('../../db/models');
const paginate = require('express-paginate');

// ----- Private -----

const checkValidationsMiddleware = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new BadRequestResponse(
      'Validation Errors',
      errors.array().map((e) => e.msg)
    );
  }
};

const existsIn = (model) => async (value) => {
  if (!value) return Promise.reject();
  const count = await model.count({ where: { id: value } });
  return count > 0 ? Promise.resolve() : Promise.reject();
};

const changeStatusFromPending = async (id, newStatus) => {
  const requestSupply = await RequestSupply.findOne({ where: { id } });
  if (!requestSupply) throw new BadRequestResponse('Request Supply not exists');
  if (!['Approved', 'Rejected'].includes(newStatus))
    throw new BadRequestResponse('Invalid Request Supply Status');
  if (requestSupply.status !== 'Pending')
    throw new BadRequestResponse('Request Supply is not Pending');

  requestSupply.status = newStatus;
  await requestSupply.save();

  return requestSupply;
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
  const where = {};
  const { status } = req.query;

  // If not admin, filter by user
  if (!req.jwt.admin) {
    const user = await User.findOne({ where: { email: req.jwt.email } });
    where.userId = user.id;
  }

  if (status) where.status = status;
  const results = await RequestSupply.findAndCountAll({
    where,
    limit: req.query.limit,
    offset: req.skip,
    order: [['createdAt', 'DESC']],
  });

  const itemCount = results.count;
  const pageCount = Math.ceil(results.count / req.query.limit);
  return res.jsonOK({
    requestSupplies: results.rows,
    pageCount,
    itemCount,
    pages: paginate.getArrayPages(req)(3, pageCount, req.query.page),
  });
};

/**
 * GET /request-supplies/:id
 */
const getRequestSupply = async (req, res) => {
  const { id } = req.params;
  const { status } = req.query;
  const where = { id };

  // If not admin, filter by user
  if (!req.jwt.admin) {
    const user = await User.findOne({ where: { email: req.jwt.email } });
    where.userId = user.id;
  }

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

  const requestSupply = await RequestSupply.findOne({
    where: { id, userId: user.id },
  });
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
    throw new BadRequestResponse('Error creating request Supply', [
      error.toString(),
    ]);
  }
};

/**
 * PATCH /request-supplies/:id
 * body: { status: 'Approved' } | { status: 'Rejected' }
 */
const upgradeRequestSupplyStatus = async (req, res) => {
  const requestSupply = await changeStatusFromPending(
    req.params.id,
    req.body.status
  );
  return res.jsonOK(requestSupply);
};

module.exports = {
  cancelRequestSupply,
  createRequestSupply,
  getRequestSupplies,
  getRequestSupply,
  requestValidations,
  upgradeRequestSupplyStatus,
};
