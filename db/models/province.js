module.exports = (sequelize, DataTypes) => {
  const Province = sequelize.define('Province', {
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

  Province.associate = (models) => {
    Province.hasMany(models.Town, {
      as: 'towns',
      foreignKey: {
        name: 'provinceId',
        allowNull: true,
      },
    });
  };

  return Province;
};
