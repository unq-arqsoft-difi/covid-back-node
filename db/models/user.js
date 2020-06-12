module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    entity: DataTypes.STRING,
    job: DataTypes.STRING,
    place: DataTypes.STRING,
    pass: DataTypes.STRING,
  }, {});
  return User;
};
