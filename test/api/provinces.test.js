require('jest-extended');
const request = require('supertest');
const { OK } = require('http-status-codes');
const app = require('../../src/server');
const { Province } = require('../../db/models');

describe('Provinces', () => {
  beforeEach(async () => {
    await Province.sync({ force: true });
  });
  test('Empty list', async () => {
    const { body, status } = await request(app).get('/support/provinces');
    expect(status).toBe(OK);
    expect(body).toBeEmpty();
    expect(body).toBeArrayOfSize(0);
  });
  test('Add a Province', async () => {
    await Province.create({ id: '01', name: 'The North' });
    const { body, status } = await request(app).get('/support/provinces');
    expect(status).toBe(OK);
    expect(body).not.toBeEmpty();
    expect(body).toBeArrayOfSize(1);
    const [province] = body;
    expect(province).toBeObject();
    expect(province).toEqual({ id: '01', name: 'The North' });
  });
});
