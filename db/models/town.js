module.exports = (sequelize, DataTypes) => {
  const Town = sequelize.define('Town', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: DataTypes.STRING,
  }, {
    order: [['name', 'ASC']],
    defaultScope: {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    },
  });

  return Town;
};
