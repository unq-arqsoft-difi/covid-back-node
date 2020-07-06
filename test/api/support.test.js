const { OK, NOT_FOUND } = require('http-status-codes');
const { api } = require('../test-case');
const {
  Area,
  Institution,
  Province,
  Supply,
  Town,
} = require('../../db/models');

describe('/support', () => {
  describe('/areas', () => {
    beforeEach(async () => Area.sync({ force: true }));

    test('Empty list', async () => {
      const { body, status } = await api.get('/support/areas');
      expect(status).toBe(OK);
      expect(body).toBeArrayOfSize(0);
    });

    test('With an Area', async () => {
      await Area.create({ id: 1, name: 'The Fingers' });
      const { body, status } = await api.get('/support/areas');
      expect(status).toBe(OK);
      expect(body).toBeArrayOfSize(1);

      const [area] = body;
      expect(area).toEqual({ id: 1, name: 'The Fingers' });
    });
  });

  describe('/provinces', () => {
    beforeEach(async () => {
      await Town.sync({ force: true });
      await Province.sync({ force: true });
    });

    test('Empty list', async () => {
      const { body, status } = await api.get('/support/provinces');
      expect(status).toBe(OK);
      expect(body).toBeArrayOfSize(0);
    });

    test('With a Province', async () => {
      await Province.create({ id: '01', name: 'The North' });
      const { body, status } = await api.get('/support/provinces');
      expect(status).toBe(OK);
      expect(body).toBeArrayOfSize(1);

      const [province] = body;
      expect(province).toEqual({ id: '01', name: 'The North' });
    });

    describe('/:id', () => {
      test('Not Found', async () => {
        const { body, status } = await api.get('/support/provinces/01');
        expect(status).toBe(NOT_FOUND);
        expect(body).toMatchObject({
          status: 404,
          message: "No Province with id '01'",
        });
      });

      test('Found', async () => {
        await Province.create({ id: '01', name: 'The North' });
        const { body, status } = await api.get('/support/provinces/01');
        expect(status).toBe(OK);
        expect(body).toMatchObject({ id: '01', name: 'The North' });
      });
    });

    describe('/:id/towns', () => {
      test('Empty towns', async () => {
        await Province.create({ id: '01', name: 'The North' });
        const { body, status } = await api.get('/support/provinces/01/towns');
        expect(status).toBe(OK);
        expect(body.towns).toBeArrayOfSize(0);
      });

      test('Add a Town', async () => {
        await Province.create({
          id: '01',
          name: 'The North',
          towns: [{
            id: 'ABC',
            name: 'Winterfell',
          }],
        }, { include: [{ model: Town, as: 'towns' }] });

        const { body, status } = await api.get('/support/provinces/01/towns');
        expect(status).toBe(OK);
        expect(body.towns).toBeArrayOfSize(1);

        const [town] = body.towns;
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
      const { body, status } = await api.get('/support/institutions');
      expect(status).toBe(OK);
      expect(body).toBeArrayOfSize(0);
    });

    test('With an Institution', async () => {
      await Institution.create({
        id: '01',
        name: 'Citadel',
        funding: 'Municipal',
        town: {
          id: '11',
          name: 'OldTown',
        },
        province: {
          id: '21',
          name: 'Westeros',
        },
      }, {
        include: [
          { model: Town, as: 'town' },
          { model: Province, as: 'province' },
        ],
      });

      const { body, status } = await api.get('/support/institutions');
      expect(status).toBe(OK);
      expect(body).toBeArrayOfSize(1);

      const [area] = body;
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
    beforeEach(async () => Supply.sync({ force: true }));

    test('Empty list', async () => {
      const { body, status } = await api.get('/support/supplies');
      expect(status).toBe(OK);
      expect(body).toBeArrayOfSize(0);
    });

    test('With a Supply', async () => {
      await Supply.create({
        id: 1,
        name: 'Gloves',
        stock: 10000,
      });
      const { body, status } = await api.get('/support/supplies');
      expect(status).toBe(OK);
      expect(body).toBeArrayOfSize(1);

      const [supply] = body;
      expect(supply).toEqual({
        id: 1,
        name: 'Gloves',
        stock: 10000,
      });
    });
  });
});
