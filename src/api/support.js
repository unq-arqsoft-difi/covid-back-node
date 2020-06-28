const { Province, Town } = require('../../db/models');

const handling = async (callback, req, res, next) => {
  try {
    return callback(req, res, next);
  } catch (error) {
    next(error);
  }
};

const allTowns = async (req, res, next) => {
  try {
    const info = await Town.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt', 'provinceId'] },
      include: [{
        model: Province,
        as: 'province',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      }],
    });
    res.jsonOK(info);
  } catch (error) {
    next(error);
  }
};

const allProvinces = async (req, res, next) => {
  try {
    const info = await Province.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
    res.jsonOK(info);
  } catch (error) {
    next(error);
  }
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
  idProvince: async (req, res, next) => handling(idProvince, req, res, next),
};
