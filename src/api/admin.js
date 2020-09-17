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
 * PATCH /request-supplies/:id
 * body: { status: 'Approved' } | { status: 'Rejected' }
 */
const upgradeRequestSupplyStatus = async (req, res) => {
  const requestSupply = await changeStatusFromPending(req.params.id, req.body.status);
  return res.jsonOK(requestSupply);
};

module.exports = {
  upgradeRequestSupplyStatus,
};
