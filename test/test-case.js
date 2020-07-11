require('dotenv').config({ path: './.env.test' });

const request = require('supertest');
require('./jest-extensions');
const app = require('../src/server');
const {
  Area,
  Institution,
  Province,
  RequestSupply,
  Supply,
  Town,
  User,
} = require('../db/models');

const withToken = (req, token) => {
  if (token) req.set('Authorization', `Bearer ${token}`);
  return req.expect('Content-Type', /json/);
};

const api = {
  get: (path, token) => withToken(request(app).get(path), token),
  post: (path, data = {}, token) => withToken(request(app).post(path).send(data), token),
  delete: (path, token) => withToken(request(app).delete(path), token),
};

const clearDatabase = async () => {
  await Supply.sync({ force: true });
  await RequestSupply.sync({ force: true });
  await User.sync({ force: true });
  await Area.sync({ force: true });
  await Institution.sync({ force: true });
  await Province.sync({ force: true });
  await Town.sync({ force: true });
};

module.exports = {
  api,
  app,
  clearDatabase,
  request,
};
