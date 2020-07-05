module.exports = (sequelize, DataTypes) => {
  const Area = sequelize.define('Area', {
    name: DataTypes.STRING,
  }, {
    defaultScope: {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    },
  });
  return Area;
};
