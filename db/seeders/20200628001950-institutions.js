const axios = require('axios');
const logger = require('../../src/lib/logger');
const { Town } = require('../models');

function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    return content.slice(1);
  }
  return content;
}

async function townId(institution) {
  const town = await Town.findOne({
    where: { name: institution.localidad_nombre },
    attributes: ['id', 'name'],
  });
  return town ? town.id : null;
}

const url = 'http://datos.salud.gob.ar/dataset/336cf4d9-447a-44c4-8e34-0ba1fc293d55/resource/a7b106d5-effe-4c98-846a-ac81b8f48cb0/download/listado-establecimientos-salud-asentados-registro-federal-refes-201908.json';

const fetchInstitutions = () => axios.get(url)
  .then(async (res) => {
    const data = stripBOM(res.data); // algún forro retorna UTF-8 with BOM
    const institutions = JSON.parse(data);
    const mapped = await Promise.all(institutions.map(async institution => ({
      id: institution.establecimiento_id,
      name: institution.establecimiento_nombre,
      funding: institution.origen_financiamiento,
      townId: await townId(institution), // algún otro forro no normalizó los IDs
      provinceId: institution.provincia_id.padStart(2, '0'),
      createdAt: new Date(),
      updatedAt: new Date(),
    })));
    return mapped.sort((a, b) => a.id.localeCompare(b.id));
  }).catch((error) => {
    logger.error(error);
    throw new Error(error);
  });

module.exports = {
  up: async queryInterface => queryInterface.bulkInsert('Institutions', await fetchInstitutions(), {}),
  down: queryInterface => queryInterface.bulkDelete('Institutions', null, {}),
};
