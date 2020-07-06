const {
  Area,
  Institution,
  Province,
  Supply,
  Town,
} = require('../../db/models');

// ----- Private -----

const allFrom = model => async (req, res) => res.jsonOK(await model.findAll());

// ----- Public -----

const allAreas = allFrom(Area);
const allInstitutions = allFrom(Institution);
const allProvinces = allFrom(Province);
const allSupplies = allFrom(Supply);

const idProvince = async (req, res) => {
  const { id } = req.params;
  const province = await Province.findByPk(id);
  return province
    ? res.jsonOK(province)
    : res.jsonNotFound(`No Province with id '${id}'`);
};

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

module.exports = {
  allAreas,
  allInstitutions,
  allProvinces,
  allSupplies,
  idProvince,
  idProvinceTowns,
};
