module.exports = (sequelize, DataTypes) => {
  const Province = sequelize.define('Province', {
    name: DataTypes.STRING,
  }, {});

  return Province;
};
