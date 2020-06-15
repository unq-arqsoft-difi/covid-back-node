module.exports = (sequelize, DataTypes) => {
  const Town = sequelize.define('Town', {
    name: DataTypes.STRING,
  }, {});

  Town.associate = (models) => {
    Town.belongsTo(models.Province, { foreignKey: 'provinceId', as: 'province' });
  };

  return Town;
};
