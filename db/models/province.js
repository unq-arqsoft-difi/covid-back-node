module.exports = (sequelize, DataTypes) => {
  const Province = sequelize.define('Province', {
    name: DataTypes.STRING,
  }, {});

  Province.associate = (models) => {
    Province.hasMany(models.Town);
  };

  return Province;
};
