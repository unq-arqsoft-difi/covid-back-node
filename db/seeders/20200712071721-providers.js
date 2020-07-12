const providers = require('./data-providers.json');

const parseProviders = () => providers.map(provider => ({
  name: provider,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

module.exports = {
  up: async queryInterface => queryInterface.bulkInsert('Providers', parseProviders(), {}),
  down: queryInterface => queryInterface.bulkDelete('Providers', null, {}),
};
