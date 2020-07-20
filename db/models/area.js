module.exports = (sequelize, DataTypes) => {
  const Area = sequelize.define('Area', {
    name: DataTypes.STRING,
  }, {
    order: [['name', 'ASC']],
    defaultScope: {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    },
  });
  return Area;
};
