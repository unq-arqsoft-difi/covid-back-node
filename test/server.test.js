require('dotenv').config({ path: `${__dirname}/../.env.test` });
require('./jest-extensions');
const request = require('supertest')
const app = require('../src/server')
const { NOT_FOUND } = require('http-status-codes');

describe('Hi Endpoints', () => {
  const resposeSchema = {
    result: { type: 'string' }
  }

  it('should response 404 when request invalid url', async () => {
    var res = await request(app)
    .get('/invalidURL')
    .send()
  expect(res.status).toBe(NOT_FOUND)
  })
})