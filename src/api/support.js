const { Province, Town } = require('../../db/models');

const idProvinceTowns = async (req, res) => {
  const { id } = req.params;
  const province = await Province.findOne({
    where: { id },
    include: [{
      model: Town,
      as: 'towns',
      attributes: { exclude: [...Town.options.defaultScope.attributes.exclude, 'ProvinceId'] },
    }],
    order: [
      [{ model: Town, as: 'towns' }, 'name', 'ASC'],
    ],
  });
  return province
    ? res.jsonOK(province)
    : res.jsonNotFound(`No Province with id '${id}'`);
};

const allProvinces = async (req, res) => {
  const info = await Province.findAll();
  res.jsonOK(info);
};

const idProvince = async (req, res) => {
  const { id } = req.params;
  const province = await Province.findByPk(id);
  return province
    ? res.jsonOK(province)
    : res.jsonNotFound(`No Province with id '${id}'`);
};

module.exports = {
  allProvinces,
  idProvinceTowns,
  idProvince,
};
