const { Province } = require('../../db/models');

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

module.exports = { allProvinces };
