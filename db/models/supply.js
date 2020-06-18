module.exports = (sequelize, DataTypes) => {
  const Supply = sequelize.define('Supply', {
    name: DataTypes.STRING,
    stock: DataTypes.INTEGER,
  }, {});
  return Supply;
};
