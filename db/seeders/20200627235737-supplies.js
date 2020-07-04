const supplies = require('./data-supplies.json');

const parseSupplies = () => supplies.map(supply => ({
  name: supply.name,
  stock: supply.stock,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

module.exports = {
  up: async queryInterface => queryInterface.bulkInsert('Supplies', parseSupplies(), {}),
  down: queryInterface => queryInterface.bulkDelete('Supplies', null, {}),
};
