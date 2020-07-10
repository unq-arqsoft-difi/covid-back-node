const { OK, CREATED, BAD_REQUEST } = require('http-status-codes');
const { api, helpers } = require('../test-case');
const {
  Area,
  RequestSupply,
  Supply,
  User,
} = require('../../db/models');

describe('Request Supplies', () => {
  beforeEach(async () => {
    await RequestSupply.sync({ force: true });
  });

  describe('GET /request-supplies', () => {
    it('Without Token response error', async () => {
      const res = await api.get('/request-supplies');
      expect(res).not.toBeValidToken();
    });

    describe('With Token', () => {
      let token;
      beforeAll(async () => {
        await User.sync({ force: true });
        token = await helpers.generateToken({ email: 'jon@snow.com' });
      });
      beforeEach(async () => {
        await Area.sync({ force: true });
        await Supply.sync({ force: true });
      });

      test('Empty list', async () => {
        const res = await api.get('/request-supplies', token);
        expect(res.status).toBe(OK);
        expect(res.body).toBeArrayOfSize(0);
      });

      test('With data', async () => {
        const user = await User.findOne({ where: { email: 'jon@snow.com' } });
        await RequestSupply.create({
          userId: user.id,
          supply: { name: 'Gloves', stock: 1000 },
          area: { name: 'The Citadel' },
          amount: 10,
          status: 'Pending',
        }, {
          include: [
            { model: Supply, as: 'supply' },
            { model: Area, as: 'area' },
          ],
        });

        const res = await api.get('/request-supplies', token);
        expect(res.status).toBe(OK);
        expect(res.body).toBeArrayOfSize(1);
        const [reqSupply] = res.body;
        expect(reqSupply).toContainEntry(['id', 1]);
        expect(reqSupply).toContainEntry(['userId', user.id]);
        expect(reqSupply).toContainEntry(['supplyId', 1]);
        expect(reqSupply).toContainEntry(['areaId', 1]);
        expect(reqSupply).toContainEntry(['amount', 10]);
        expect(reqSupply).toContainEntry(['status', 'Pending']);
      });
    });
  });

  describe('POST /request-supplies', () => {
    it('Without Token response error', async () => {
      const data = {};
      const res = await api.post('/request-supplies', data);
      expect(res).not.toBeValidToken();
    });

    describe('With Token', () => {
      let token;
      beforeAll(async () => {
        await User.sync({ force: true });
        token = await helpers.generateToken();
      });
      beforeEach(async () => {
        await Area.sync({ force: true });
        await Supply.sync({ force: true });
      });

      it('Data Validation (empty data)', async () => {
        const data = {};
        const res = await api.post('/request-supplies', data, token);
        expect(res.status).toBe(BAD_REQUEST);
        expect(res.body).toContainEntry(['status', BAD_REQUEST]);
        expect(res.body).toContainEntry(['message', 'Validation Errors']);
        expect(res.body.errors).toIncludeAllMembers(['Invalid Area ID', 'Invalid Supply ID']);
      });

      it('Data Validation (invalid data)', async () => {
        const area = await Area.create({ name: 'Therapy' });
        const supply = await Supply.create({ name: 'Gloves' });
        const data = {
          areaId: area.id + 1,
          supplyId: supply.id + 1,
        };
        const res = await api.post('/request-supplies', data, token);
        expect(res.status).toBe(BAD_REQUEST);
        expect(res.body).toContainEntry(['status', BAD_REQUEST]);
        expect(res.body).toContainEntry(['message', 'Validation Errors']);
        expect(res.body.errors).toIncludeAllMembers(['Invalid Area ID', 'Invalid Supply ID']);
      });

      it('Success Request Supplies', async () => {
        const area = await Area.create({ name: 'Therapy' });
        const supply = await Supply.create({ name: 'Gloves' });
        const data = {
          areaId: area.id,
          supplyId: supply.id,
          amount: 3,
        };
        const res = await api.post('/request-supplies', data, token);
        expect(res.status).toBe(CREATED);
        expect(res.body).toContainEntry(['created', true]);
        expect(res.body.request).toContainKey('userId');
        expect(res.body.request).toContainEntry(['id', 1]);
        expect(res.body.request).toContainEntry(['areaId', area.id]);
        expect(res.body.request).toContainEntry(['supplyId', supply.id]);
        expect(res.body.request).toContainEntry(['amount', 3]);
        expect(res.body.request).toContainEntry(['status', 'Pending']);
      });
    });
  });
});
