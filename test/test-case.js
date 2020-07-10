require('dotenv').config({ path: './.env.test' });

const request = require('supertest');
require('./jest-extensions');
const app = require('../src/server');

const api = {
  get: path => request(app).get(path).expect('Content-Type', /json/),
  put: (path, data = {}) => request(app).put(path).send(data).expect('Content-Type', /json/),
  post: (path, data = {}, token = null) => {
    const req = request(app).post(path).send(data);
    if (token) req.set('Authorization', `Bearer ${token}`);
    return req.expect('Content-Type', /json/);
  },
  delete: path => request(app).delete(path),
};

const register = async data => api.post('/users', {
  firstName: 'Jon',
  lastName: 'Snow',
  email: 'jon.snow@winterfell.com',
  phone: '+54 11 4444-5555',
  entity: 'Hospital Alemán',
  job: 'Enfermero',
  place: 'Ciudad Autónoma de Buenos Aires',
  pass: '1234',
  ...data,
});

const login = async data => api.post('/login', {
  email: 'jon.snow@winterfell.com',
  pass: '1234',
  ...data,
});

const generateToken = async () => {
  await register();
  return login().then(res => res.body.token);
};

module.exports = {
  api,
  app,
  request,
  helpers: { register, login, generateToken },
};
