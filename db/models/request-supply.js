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
    amount: DataTypes.INTEGER,
    status: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'RequestSupply',
    order: [['createdAt', 'DESC']],
    defaultScope: {
      include: ['area', 'user', 'supply'],
    },
  });

  return RequestSupply;
};
