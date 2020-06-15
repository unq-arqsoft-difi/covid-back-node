const express = require('express');
const { Province, Town } = require('../../db/models');

const router = express.Router();

const getAll = async (req, res, next) => {
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

// Routes
router.get('/', getAll);

module.exports = router;
