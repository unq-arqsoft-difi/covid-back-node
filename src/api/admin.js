const { BadRequestResponse } = require('../lib/api-error');
const { RequestSupply } = require('../../db/models');

// ----- Private -----

const changeStatusFromPending = async (id, newStatus) => {
  const requestSupply = await RequestSupply.findOne({ where: { id } });
  if (!requestSupply) throw new BadRequestResponse('Request Supply not exists');
  if (!['Approved', 'Rejected'].includes(newStatus)) throw new BadRequestResponse('Invalid Request Supply Status');
  if (requestSupply.status !== 'Pending') throw new BadRequestResponse('Request Supply is not Pending');

  requestSupply.status = newStatus;
  await requestSupply.save();

  return requestSupply;
};

// ----- Public -----

/**
 * GET /admin/request-supplies
 */
const allRequestSupplies = async (req, res) => {
  const where = {};
  const { status } = req.query;
  if (status) where.status = status;
  const requestSupplies = await RequestSupply.findAll({ where, order: [['createdAt', 'DESC']] });
  return res.jsonOK(requestSupplies);
};

/**
 * GET /admin/request-supplies/:id
 */
const getRequestSupply = async (req, res) => {
  const { id } = req.params;
  const { status } = req.query;
  const where = { id };
  if (status) where.status = status;
  const newRS = await RequestSupply.findOne({ where });
  if (!newRS) throw new BadRequestResponse('Request Supply not exists');

  return res.jsonOK(newRS);
};

/**
 * PATCH /admin/request-supplies/:id
 * body: { status: 'Approved' } | { status: 'Rejected' }
 */
const upgradeRequestSupplyStatus = async (req, res) => {
  const requestSupply = await changeStatusFromPending(req.params.id, req.body.status);
  return res.jsonOK(requestSupply);
};

module.exports = {
  allRequestSupplies,
  getRequestSupply,
  upgradeRequestSupplyStatus,
};
