const { BadRequestResponse } = require('../lib/api-error');
const {
  RequestSupply,
} = require('../../db/models');

// ----- Private -----

// ----- Public -----

/**
 * GET /admin/request-supplies
 */
const allRequestSupplies = async (req, res) => {
  const where = {};
  const { status } = req.query;
  if (status) where.status = status;
  const requestSupplies = await RequestSupply.findAll({ where });
  return res.jsonOK(requestSupplies);
};

/**
 * GET /admin/request-supplies/:id
 */
const requestSupply = async (req, res) => {
  const { id } = req.params;
  const { status } = req.query;
  const where = { id };
  if (status) where.status = status;
  const newRS = await RequestSupply.findOne({ where });
  if (!newRS) throw new BadRequestResponse('Request Supply not exists');

  return res.jsonOK(newRS);
};

module.exports = {
  requestSupply,
  allRequestSupplies,
};
