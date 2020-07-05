require('dotenv').config({ path: './.env.test' });
require('jest-extended');
const request = require('supertest');
const app = require('../src/server');

const api = {
  get: path => request(app).get(path).expect('Content-Type', /json/),
  put: (path, data = {}) => request(app).put(path).send(data).expect('Content-Type', /json/),
  post: (path, data = {}) => request(app).post(path).send(data).expect('Content-Type', /json/),
  delete: path => request(app).delete(path),
};

module.exports = {
  api,
  app,
  request,
};
