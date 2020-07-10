const admin = [{
  firstName: 'Admin',
  lastName: '',
  email: 'admin@difi.com',
  phone: '',
  institutionId: null,
  provinceId: null,
  townId: null,
  job: 'Admin',
  pass: 'difi',
  admin: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}];

module.exports = {
  up: async queryInterface => queryInterface.bulkInsert('Users', admin, {}),
  down: () => {},
};
