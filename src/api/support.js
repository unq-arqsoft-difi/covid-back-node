const { Province, Town } = require('../../db/models');

const allTowns = async (req, res) => {
  const info = await Town.findAll({
    attributes: { exclude: ['provinceId'] },
    include: [{
      model: Province,
      as: 'province',
    }],
  });
  res.jsonOK(info);
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
  allTowns,
  idProvince,
};
