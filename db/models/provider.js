module.exports = (sequelize, DataTypes) => {
  const Provider = sequelize.define('Provider', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: DataTypes.STRING,
  }, {
    defaultScope: {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    },
  });

  return Provider;
};
