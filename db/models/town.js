module.exports = (sequelize, DataTypes) => {
  const Town = sequelize.define('Town', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: DataTypes.STRING,
  }, {});

  Town.associate = (models) => {
    Town.belongsTo(models.Province, { as: 'province' });
  };

  return Town;
};
