module.exports = (sequelize, DataTypes) => {
  const Province = sequelize.define('Province', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: DataTypes.STRING,
  }, {});

  return Province;
};
