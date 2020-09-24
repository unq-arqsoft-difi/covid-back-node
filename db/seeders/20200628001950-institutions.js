const institutions = require('./data-institutions.json');

const parseInstitutions = () => institutions.map(institution => ({
  id: `${institution.id}`,
  name: institution.name,
  funding: institution.funding,
  townId: `${institution.townId}`,
  provinceId: `${institution.provinceId}`,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

module.exports = {
  up: async queryInterface => queryInterface.bulkInsert('Institutions', parseInstitutions(), {}),
  down: queryInterface => queryInterface.bulkDelete('Institutions', null, {}),
};
