const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Institution extends Model {
    static associate(models) {
      Institution.belongsTo(models.Town, { as: 'town' });
      Institution.belongsTo(models.Province, { as: 'province' });
    }
  }

  Institution.init({
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    funding: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Institution',
  });

  return Institution;
};
