require('dotenv').config({ path: './.env.test' });
const request = require('supertest');
const { NOT_FOUND } = require('http-status-codes');
const app = require('../src/server');

describe('Server', () => {
  it('Should response 404 when request for an non-existing route', async () => {
    const res = await request(app).get('/invalidURL').send();
    expect(res.status).toBe(NOT_FOUND);
  });
});
