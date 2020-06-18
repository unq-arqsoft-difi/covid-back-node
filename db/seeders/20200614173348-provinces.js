const axios = require('axios');
const logger = require('winston');

const url = 'https://infra.datos.gob.ar/catalog/modernizacion/dataset/7/distribution/7.2/download/provincias.json';

const fetchProvinces = () => axios.get(url)
  .then(res => res.data.provincias.map(province => ({
    id: province.id,
    name: province.nombre,
    createdAt: new Date(),
    updatedAt: new Date(),
  })).sort((a, b) => a.id.localeCompare(b.id)))
  .catch((error) => {
    logger.error(error);
    throw new Error(error);
  });

module.exports = {
  up: async queryInterface => queryInterface.bulkInsert('Provinces', await fetchProvinces(), {}),
  down: queryInterface => queryInterface.bulkDelete('Provinces', null, {}),
};
