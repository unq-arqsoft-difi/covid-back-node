const {
  Area,
  Institution,
  Provider,
  Province,
  Supply,
  Town,
} = require('../../db/models');

// ----- Private -----

const allFrom = model => async (req, res) => res.jsonOK(await model.findAll({ order: [['name', 'ASC']] }));

// ----- Public -----

const allAreas = allFrom(Area);
const allInstitutions = allFrom(Institution);
const allProvinces = allFrom(Province);
const allSupplies = allFrom(Supply);
const allProviders = allFrom(Provider);

const idProvince = async (req, res) => {
  const { id } = req.params;
  const includeTowns = req.query.include === 'towns';
  const options = { where: { id } };
  if (includeTowns) {
    options.include = [{
      model: Town,
      as: 'towns',
      attributes: { exclude: [...Town.options.defaultScope.attributes.exclude, 'provinceId'] },
    }];
    options.order = [
      [{ model: Town, as: 'towns' }, 'name', 'ASC'],
    ];
  }
  const province = await Province.findOne(options);
  return province
    ? res.jsonOK(province)
    : res.jsonNotFound(`No Province with id '${id}'`);
};

module.exports = {
  allAreas,
  allInstitutions,
  allProviders,
  allProvinces,
  allSupplies,
  idProvince,
};
