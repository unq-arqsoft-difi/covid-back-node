require('dotenv').config({ path: `${__dirname}/../.env.test` });
const request = require('supertest')
const app = require('../../src/server')
const { OK } = require('http-status-codes');

describe('Hi Endpoints', () => {
  it('/hi', async () => {

    var res = await request(app)
    .get('/hi')
    .send()
  expect(res.status).toBe(OK)
  expect(res.body).toHaveProperty('result')
  })
})