const axios = require('axios');
const { logger } = require('winston');

const url = 'https://infra.datos.gob.ar/catalog/modernizacion/dataset/7/distribution/7.5/download/localidades.json';

const fetchTowns = () => axios.get(url)
  .then(res => res.data.localidades.map(town => ({
    id: town.id,
    name: town.nombre,
    provinceId: town.provincia.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  })).sort((a, b) => a.id.localeCompare(b.id)))
  .catch((error) => {
    logger.error(error);
    throw new Error(error);
  });

module.exports = {
  up: async queryInterface => queryInterface.bulkInsert('Towns', await fetchTowns(), {}),
  down: queryInterface => queryInterface.bulkDelete('Towns', null, {}),
};
