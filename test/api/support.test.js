const { OK, NOT_FOUND } = require('http-status-codes');
const { api } = require('../test-case');
const { Area, Province, Town } = require('../../db/models');

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

    describe('/provinces/:id', () => {
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

    describe('/provinces/:id/towns', () => {
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
});
