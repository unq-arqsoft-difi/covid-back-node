module.exports = (sequelize, DataTypes) => {
  const Supply = sequelize.define('Supply', {
    name: DataTypes.STRING,
    stock: DataTypes.INTEGER,
  }, {
    order: [['name', 'ASC']],
    defaultScope: {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    },
  });
  return Supply;
};
