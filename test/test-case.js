require('dotenv').config({ path: './.env.test' });

const request = require('supertest');
require('./jest-extensions');
const app = require('../src/server');

const withToken = (req, token) => {
  if (token) req.set('Authorization', `Bearer ${token}`);
  return req.expect('Content-Type', /json/);
};

const api = {
  get: (path, token) => withToken(request(app).get(path), token),

  put: (path, data = {}) => request(app).put(path).send(data).expect('Content-Type', /json/),

  post: (path, data = {}, token) => withToken(request(app).post(path).send(data), token),

  delete: (path, token) => withToken(request(app).delete(path), token),
};

module.exports = {
  api,
  app,
  request,
};
