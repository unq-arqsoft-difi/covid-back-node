const areas = require('./data-areas.json');

const parseAreas = () => areas.map(area => ({
  name: area,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

module.exports = {
  up: async queryInterface => queryInterface.bulkInsert('Areas', parseAreas(), {}),
  down: queryInterface => queryInterface.bulkDelete('Areas', null, {}),
};
