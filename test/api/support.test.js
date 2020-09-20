const { OK, NOT_FOUND } = require('http-status-codes').StatusCodes;
const { api, clearDatabase } = require('../test-case');
const {
  Area,
  Institution,
  Provider,
  Province,
  Supply,
  Town,
} = require('../../db/models');

describe('/support', () => {
  beforeEach(async () => clearDatabase());

  describe('/areas', () => {
    test('Empty list', async () => {
      const res = await api.get('/support/areas');
      expect(res.status).toBe(OK);
      expect(res.body).toBeArrayOfSize(0);
    });

    test('With an Area', async () => {
      await Area.create({ id: 1, name: 'The Fingers' });
      const res = await api.get('/support/areas');
      expect(res.status).toBe(OK);
      expect(res.body).toBeArrayOfSize(1);

      const [area] = res.body;
      expect(area).toEqual({ id: 1, name: 'The Fingers' });
    });
  });

  describe('/provinces', () => {
    test('Empty list', async () => {
      const res = await api.get('/support/provinces');
      expect(res.status).toBe(OK);
      expect(res.body).toBeArrayOfSize(0);
    });

    test('With a Province', async () => {
      await Province.create({ id: '01', name: 'The North' });
      const res = await api.get('/support/provinces');
      expect(res.status).toBe(OK);
      expect(res.body).toBeArrayOfSize(1);

      const [province] = res.body;
      expect(province).toEqual({ id: '01', name: 'The North' });
    });

    describe('/:id', () => {
      test('Not Found', async () => {
        const res = await api.get('/support/provinces/01');
        expect(res.status).toBe(NOT_FOUND);
        expect(res.body).toMatchObject({
          status: 404,
          message: "No Province with id '01'",
        });
      });

      test('Found', async () => {
        await Province.create({ id: '01', name: 'The North' });
        const res = await api.get('/support/provinces/01');
        expect(res.status).toBe(OK);
        expect(res.body).toMatchObject({ id: '01', name: 'The North' });
      });
    });

    describe('/:id?include=towns', () => {
      test('Empty towns', async () => {
        await Province.create({ id: '01', name: 'The North' });
        const res = await api.get('/support/provinces/01?include=towns');
        expect(res.status).toBe(OK);
        expect(res.body.towns).toBeArrayOfSize(0);
      });

      test('Add a Town', async () => {
        await Province.create({
          id: '01',
          name: 'The North',
          towns: [{ id: 'ABC', name: 'Winterfell' }],
        }, { include: [{ model: Town, as: 'towns' }] });

        const res = await api.get('/support/provinces/01?include=towns');
        expect(res.status).toBe(OK);
        expect(res.body.towns).toBeArrayOfSize(1);

        const [town] = res.body.towns;
        expect(town).toEqual({ id: 'ABC', name: 'Winterfell' });
      });
    });
  });

  describe('/institutions', () => {
    beforeEach(async () => {
      await Town.sync({ force: true });
      await Province.sync({ force: true });
      await Institution.sync({ force: true });
    });

    test('Empty list', async () => {
      const res = await api.get('/support/institutions');
      expect(res.status).toBe(OK);
      expect(res.body).toBeArrayOfSize(0);
    });

    test('With an Institution', async () => {
      await Institution.create({
        id: '01',
        name: 'Citadel',
        funding: 'Municipal',
        town: { id: '11', name: 'OldTown' },
        province: { id: '21', name: 'Westeros' },
      }, {
        include: [
          { model: Town, as: 'town' },
          { model: Province, as: 'province' },
        ],
      });

      const res = await api.get('/support/institutions');
      expect(res.status).toBe(OK);
      expect(res.body).toBeArrayOfSize(1);

      const [area] = res.body;
      expect(area).toEqual({
        id: '01',
        name: 'Citadel',
        funding: 'Municipal',
        townId: '11',
        provinceId: '21',
      });
    });
  });

  describe('/supplies', () => {
    test('Empty list', async () => {
      const res = await api.get('/support/supplies');
      expect(res.status).toBe(OK);
      expect(res.body).toBeArrayOfSize(0);
    });

    test('With a Supply', async () => {
      await Supply.create({
        id: 1,
        name: 'Gloves',
        stock: 10000,
      });
      const res = await api.get('/support/supplies');
      expect(res.status).toBe(OK);
      expect(res.body).toBeArrayOfSize(1);

      const [supply] = res.body;
      expect(supply).toEqual({
        id: 1,
        name: 'Gloves',
        stock: 10000,
      });
    });
  });

  describe('providers', () => {
    test('Empty list', async () => {
      const res = await api.get('/support/providers');
      expect(res.status).toBe(OK);
      expect(res.body).toBeArrayOfSize(0);
    });

    test('With a Provider', async () => {
      await Provider.create({
        id: 1,
        name: 'Conicet',
        stock: 10000,
      });
      const res = await api.get('/support/providers');
      expect(res.status).toBe(OK);
      expect(res.body).toBeArrayOfSize(1);

      const [supply] = res.body;
      expect(supply).toEqual({
        id: '1',
        name: 'Conicet',
      });
    });
  });
});
