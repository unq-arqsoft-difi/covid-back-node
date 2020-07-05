const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RequestSupply extends Model {
    static associate(models) {
      RequestSupply.belongsTo(models.User, { as: 'user' });
      RequestSupply.belongsTo(models.Area, { as: 'area' });
      RequestSupply.belongsTo(models.Supply, { as: 'supply' });
    }
  }

  RequestSupply.init({
    status: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'RequestSupply',
  });

  return RequestSupply;
};
