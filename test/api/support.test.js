require('jest-extended');
const request = require('supertest');
const { OK } = require('http-status-codes');
const app = require('../../src/server');
const { Province, Town } = require('../../db/models');

describe('Support', () => {
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
  describe('Towns', () => {
    beforeEach(async () => {
      await Province.sync({ force: true });
      await Town.sync({ force: true });
    });
    test('Empty list', async () => {
      const { body, status } = await request(app).get('/support/towns');
      expect(status).toBe(OK);
      expect(body).toBeEmpty();
      expect(body).toBeArrayOfSize(0);
    });
    test('Add a Town', async () => {
      await Province.create({ id: '01', name: 'The North' })
        .then(async province => Town.create({
          id: 'ABC',
          name: 'Winterfell',
          provinceId: province.id,
        }));

      const { body, status } = await request(app).get('/support/towns');
      expect(status).toBe(OK);
      expect(body).not.toBeEmpty();
      expect(body).toBeArrayOfSize(1);

      const [town] = body;
      expect(town).toBeObject();
      expect(town).toEqual({
        id: 'ABC',
        name: 'Winterfell',
        province: {
          id: '01',
          name: 'The North',
        },
      });
    });
  });
});