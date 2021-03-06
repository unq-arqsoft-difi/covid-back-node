const { OK, CREATED, BAD_REQUEST } = require('http-status-codes').StatusCodes;
const { api, clearDatabase } = require('../test-case');
const builder = require('../builder');
const {
  Area, RequestSupply, Supply, User,
} = require('../../db/models');

describe('Request Supplies', () => {
  let token;
  let tokenAdmin;
  let loggedUser;
  beforeEach(async () => {
    await clearDatabase();
    token = await builder.generateToken({ email: 'jon@snow.com' });
    loggedUser = await User.findOne({ where: { email: 'jon@snow.com' } });
    tokenAdmin = await builder.generateTokenAdmin({ email: 'juan@nieve.com' });
  });

  describe('GET /request-supplies', () => {
    test('Without Token response error', async () => {
      const res = await api.get('/request-supplies');
      expect(res).not.toBeValidToken();
    });

    describe('With User Token', () => {
      test('Empty list', async () => {
        const res = await api.get('/request-supplies', token);
        expect(res.status).toBe(OK);
        expect(res.body.requestSupplies).toBeArrayOfSize(0);
      });

      test('With data', async () => {
        await RequestSupply.create(
          {
            userId: loggedUser.id,
            supply: { name: 'Gloves', stock: 1000 },
            area: { name: 'The Citadel' },
            amount: 10,
            status: 'Pending',
          },
          {
            include: [
              { model: Supply, as: 'supply' },
              { model: Area, as: 'area' },
            ],
          },
        );

        const res = await api.get('/request-supplies', token);
        expect(res.status).toBe(OK);
        expect(res.body.requestSupplies).toBeArrayOfSize(1);
        const [reqSupply] = res.body.requestSupplies;
        expect(reqSupply).toContainEntry(['id', 1]);
        expect(reqSupply).toContainEntry(['userId', loggedUser.id]);
        expect(reqSupply).toContainEntry(['supplyId', 1]);
        expect(reqSupply).toContainEntry(['areaId', 1]);
        expect(reqSupply).toContainEntry(['amount', 10]);
        expect(reqSupply).toContainEntry(['status', 'Pending']);
      });

      test('Only pending', async () => {
        await RequestSupply.create(
          {
            userId: loggedUser.id,
            supply: { name: 'Gloves', stock: 1000 },
            area: { name: 'The Citadel' },
            amount: 30,
            status: 'Approved',
          },
          {
            include: [
              { model: Supply, as: 'supply' },
              { model: Area, as: 'area' },
            ],
          },
        );
        await RequestSupply.create({
          userId: loggedUser.id,
          supplyId: 1,
          areaId: 1,
          amount: 20,
          status: 'Pending',
        });

        let res = await api.get('/request-supplies', token);
        expect(res.status).toBe(OK);
        expect(res.body.requestSupplies).toBeArrayOfSize(2);

        res = await api.get('/request-supplies?status=Pending', token);
        expect(res.status).toBe(OK);
        expect(res.body.requestSupplies).toBeArrayOfSize(1);

        const [reqSupply] = res.body.requestSupplies;
        expect(reqSupply).toContainEntry(['id', 2]);
        expect(reqSupply).toContainEntry(['userId', loggedUser.id]);
        expect(reqSupply).toContainEntry(['supplyId', 1]);
        expect(reqSupply).toContainEntry(['areaId', 1]);
        expect(reqSupply).toContainEntry(['amount', 20]);
        expect(reqSupply).toContainEntry(['status', 'Pending']);
      });
    });

    describe('With Admin Token', () => {
      test('Empty list', async () => {
        const res = await api.get('/request-supplies', tokenAdmin);
        expect(res.status).toBe(OK);
        expect(res.body.requestSupplies).toBeArrayOfSize(0);
      });

      test('With data', async () => {
        await RequestSupply.create(
          {
            userId: loggedUser.id,
            supply: { name: 'Gloves', stock: 1000 },
            area: { name: 'The Citadel' },
            amount: 10,
            status: 'Pending',
          },
          {
            include: [
              { model: Supply, as: 'supply' },
              { model: Area, as: 'area' },
            ],
          },
        );

        const res = await api.get('/request-supplies', tokenAdmin);
        expect(res.status).toBe(OK);
        expect(res.body.requestSupplies).toBeArrayOfSize(1);
        const [reqSupply] = res.body.requestSupplies;
        expect(reqSupply).toContainEntry(['id', 1]);
        expect(reqSupply).toContainEntry(['userId', loggedUser.id]);
        expect(reqSupply).toContainEntry(['supplyId', 1]);
        expect(reqSupply).toContainEntry(['areaId', 1]);
        expect(reqSupply).toContainEntry(['amount', 10]);
        expect(reqSupply).toContainEntry(['status', 'Pending']);
      });

      test('Only pending', async () => {
        await RequestSupply.create(
          {
            userId: loggedUser.id,
            supply: { name: 'Gloves', stock: 1000 },
            area: { name: 'The Citadel' },
            amount: 30,
            status: 'Approved',
          },
          {
            include: [
              { model: Supply, as: 'supply' },
              { model: Area, as: 'area' },
            ],
          },
        );
        await RequestSupply.create({
          userId: loggedUser.id,
          supplyId: 1,
          areaId: 1,
          amount: 20,
          status: 'Pending',
        });

        let res = await api.get('/request-supplies', tokenAdmin);
        expect(res.status).toBe(OK);
        expect(res.body.requestSupplies).toBeArrayOfSize(2);

        res = await api.get('/request-supplies?status=Pending', tokenAdmin);
        expect(res.status).toBe(OK);
        expect(res.body.requestSupplies).toBeArrayOfSize(1);

        const [reqSupply] = res.body.requestSupplies;
        expect(reqSupply).toContainEntry(['id', 2]);
        expect(reqSupply).toContainEntry(['userId', loggedUser.id]);
        expect(reqSupply).toContainEntry(['supplyId', 1]);
        expect(reqSupply).toContainEntry(['areaId', 1]);
        expect(reqSupply).toContainEntry(['amount', 20]);
        expect(reqSupply).toContainEntry(['status', 'Pending']);
      });
    });
  });

  describe('GET /request-supplies/:id', () => {
    test('Without Token response error', async () => {
      const res = await api.get('/request-supplies');
      expect(res).not.toBeValidToken();
    });

    describe('With User Token', () => {
      test('With data', async () => {
        const rs = await RequestSupply.create(
          {
            userId: loggedUser.id,
            supply: { name: 'Gloves', stock: 1000 },
            area: { name: 'The Citadel' },
            amount: 10,
            status: 'Pending',
          },
          {
            include: [
              { model: Supply, as: 'supply' },
              { model: Area, as: 'area' },
            ],
          },
        );

        const res = await api.get(`/request-supplies/${rs.id}`, token);
        expect(res.status).toBe(OK);
        expect(res.body).toBeObject();
        expect(res.body).toContainEntry(['id', 1]);
        expect(res.body).toContainEntry(['userId', loggedUser.id]);
        expect(res.body).toContainEntry(['supplyId', 1]);
        expect(res.body).toContainEntry(['areaId', 1]);
        expect(res.body).toContainEntry(['amount', 10]);
        expect(res.body).toContainEntry(['status', 'Pending']);
      });

      test('Error when invalid id', async () => {
        const anotherUser = await builder.register({ email: 'juan@nieve.com' });
        const rs = await RequestSupply.create(
          {
            userId: anotherUser.id,
            supply: { name: 'Gloves', stock: 1000 },
            area: { name: 'The Citadel' },
            amount: 30,
            status: 'Approved',
          },
          {
            include: [
              { model: Supply, as: 'supply' },
              { model: Area, as: 'area' },
            ],
          },
        );

        const res = await api.get(`/request-supplies/${rs.id}`, token);
        expect(res.status).toBe(BAD_REQUEST);
        expect(res.body).toContainEntry(['status', BAD_REQUEST]);
        expect(res.body).toContainEntry([
          'message',
          'Request Supply not exists',
        ]);
      });
    });

    describe('With Admin Token', () => {
      test('With data', async () => {
        const rs = await RequestSupply.create(
          {
            userId: loggedUser.id,
            supply: { name: 'Gloves', stock: 1000 },
            area: { name: 'The Citadel' },
            amount: 10,
            status: 'Pending',
          },
          {
            include: [
              { model: Supply, as: 'supply' },
              { model: Area, as: 'area' },
            ],
          },
        );

        const res = await api.get(`/request-supplies/${rs.id}`, tokenAdmin);
        expect(res.status).toBe(OK);
        expect(res.body).toBeObject();
        expect(res.body).toContainEntry(['id', 1]);
        expect(res.body).toContainEntry(['userId', loggedUser.id]);
        expect(res.body).toContainEntry(['supplyId', 1]);
        expect(res.body).toContainEntry(['areaId', 1]);
        expect(res.body).toContainEntry(['amount', 10]);
        expect(res.body).toContainEntry(['status', 'Pending']);
      });

      test('Error when invalid id', async () => {
        const rs = await RequestSupply.create(
          {
            userId: loggedUser.id,
            supply: { name: 'Gloves', stock: 1000 },
            area: { name: 'The Citadel' },
            amount: 30,
            status: 'Approved',
          },
          {
            include: [
              { model: Supply, as: 'supply' },
              { model: Area, as: 'area' },
            ],
          },
        );

        const res = await api.get(`/request-supplies/${rs.id + 1}`, tokenAdmin);
        expect(res.status).toBe(BAD_REQUEST);
        expect(res.body).toContainEntry(['status', BAD_REQUEST]);
        expect(res.body).toContainEntry([
          'message',
          'Request Supply not exists',
        ]);
      });
    });
  });

  describe('DELETE /request-supplies/:id', () => {
    test('Without Token response error', async () => {
      const res = await api.get('/request-supplies');
      expect(res).not.toBeValidToken();
    });

    describe('With Token', () => {
      test('With data', async () => {
        const rs = await RequestSupply.create(
          {
            userId: loggedUser.id,
            supply: { name: 'Gloves', stock: 1000 },
            area: { name: 'The Citadel' },
            amount: 10,
            status: 'Pending',
          },
          {
            include: [
              { model: Supply, as: 'supply' },
              { model: Area, as: 'area' },
            ],
          },
        );

        let res = await api.get(`/request-supplies/${rs.id}`, token);
        expect(res.status).toBe(OK);
        expect(res.body).toContainEntry(['status', 'Pending']);

        res = await api.delete(`/request-supplies/${rs.id}`, token);
        expect(res.status).toBe(OK);
        expect(res.body).toBeObject();
        expect(res.body).toContainEntry(['status', 'Canceled']);
        expect(res.body).toContainEntry(['id', 1]);
        expect(res.body).toContainEntry(['userId', loggedUser.id]);
        expect(res.body).toContainEntry(['supplyId', 1]);
        expect(res.body).toContainEntry(['areaId', 1]);
        expect(res.body).toContainEntry(['amount', 10]);
      });

      test('Error when invalid id', async () => {
        const anotherUser = await builder.register({ email: 'juan@nieve.com' });
        const rs = await RequestSupply.create(
          {
            userId: anotherUser.id,
            supply: { name: 'Gloves', stock: 1000 },
            area: { name: 'The Citadel' },
            amount: 30,
            status: 'Approved',
          },
          {
            include: [
              { model: Supply, as: 'supply' },
              { model: Area, as: 'area' },
            ],
          },
        );

        const res = await api.delete(`/request-supplies/${rs.id}`, token);
        expect(res.status).toBe(BAD_REQUEST);
        expect(res.body).toContainEntry(['status', BAD_REQUEST]);
        expect(res.body).toContainEntry([
          'message',
          'Request Supply not exists',
        ]);
      });
    });
  });

  describe('PATCH /request-supplies/:id { "status": "Approved" }', () => {
    test('Without Token response error', async () => {
      const res = await api.patch(
        '/request-supplies/1',
        { status: 'Approved' },
        token,
      );
      expect(res).not.toBeValidToken();
    });

    describe('With Admin Token', () => {
      test('Approve when is Pending', async () => {
        const rs = await RequestSupply.create(
          {
            userId: loggedUser.id,
            supply: { name: 'Gloves', stock: 1000 },
            area: { name: 'The Citadel' },
            amount: 10,
            status: 'Pending',
          },
          {
            include: [
              { model: Supply, as: 'supply' },
              { model: Area, as: 'area' },
            ],
          },
        );

        let res = await api.get(`/request-supplies/${rs.id}`, tokenAdmin);
        expect(res.status).toBe(OK);
        expect(res.body).toContainEntry(['status', 'Pending']);

        res = await api.patch(
          `/request-supplies/${rs.id}`,
          { status: 'Approved' },
          tokenAdmin,
        );
        expect(res.status).toBe(OK);
        expect(res.body).toBeObject();
        expect(res.body).toContainEntry(['status', 'Approved']);
        expect(res.body).toContainEntry(['id', 1]);
        expect(res.body).toContainEntry(['userId', loggedUser.id]);
        expect(res.body).toContainEntry(['supplyId', 1]);
        expect(res.body).toContainEntry(['areaId', 1]);
        expect(res.body).toContainEntry(['amount', 10]);
      });

      test('Reject when is Pending', async () => {
        const rs = await RequestSupply.create(
          {
            userId: loggedUser.id,
            supply: { name: 'Gloves', stock: 1000 },
            area: { name: 'The Citadel' },
            amount: 10,
            status: 'Pending',
          },
          {
            include: [
              { model: Supply, as: 'supply' },
              { model: Area, as: 'area' },
            ],
          },
        );

        let res = await api.get(`/request-supplies/${rs.id}`, tokenAdmin);
        expect(res.status).toBe(OK);
        expect(res.body).toContainEntry(['status', 'Pending']);

        res = await api.patch(
          `/request-supplies/${rs.id}`,
          { status: 'Rejected' },
          tokenAdmin,
        );
        expect(res.status).toBe(OK);
        expect(res.body).toBeObject();
        expect(res.body).toContainEntry(['status', 'Rejected']);
        expect(res.body).toContainEntry(['id', 1]);
        expect(res.body).toContainEntry(['userId', loggedUser.id]);
        expect(res.body).toContainEntry(['supplyId', 1]);
        expect(res.body).toContainEntry(['areaId', 1]);
        expect(res.body).toContainEntry(['amount', 10]);
      });

      test('Error when id not Pending', async () => {
        const rs = await RequestSupply.create(
          {
            userId: loggedUser.id,
            supply: { name: 'Gloves', stock: 1000 },
            area: { name: 'The Citadel' },
            amount: 30,
            status: 'Canceled',
          },
          {
            include: [
              { model: Supply, as: 'supply' },
              { model: Area, as: 'area' },
            ],
          },
        );

        const res = await api.patch(
          `/request-supplies/${rs.id}`,
          { status: 'Approved' },
          tokenAdmin,
        );
        expect(res.status).toBe(BAD_REQUEST);
        expect(res.body).toContainEntry(['status', BAD_REQUEST]);
        expect(res.body).toContainEntry([
          'message',
          'Request Supply is not Pending',
        ]);
      });

      test('Error when status sent is invalid', async () => {
        const rs = await RequestSupply.create(
          {
            userId: loggedUser.id,
            supply: { name: 'Gloves', stock: 1000 },
            area: { name: 'The Citadel' },
            amount: 30,
            status: 'Pending',
          },
          {
            include: [
              { model: Supply, as: 'supply' },
              { model: Area, as: 'area' },
            ],
          },
        );

        const res = await api.patch(
          `/request-supplies/${rs.id}`,
          { status: 'Canceled' },
          tokenAdmin,
        );
        expect(res.status).toBe(BAD_REQUEST);
        expect(res.body).toContainEntry(['status', BAD_REQUEST]);
        expect(res.body).toContainEntry([
          'message',
          'Invalid Request Supply Status',
        ]);
      });

      test('Error when invalid id', async () => {
        const rs = await RequestSupply.create(
          {
            userId: loggedUser.id,
            supply: { name: 'Gloves', stock: 1000 },
            area: { name: 'The Citadel' },
            amount: 30,
            status: 'Pending',
          },
          {
            include: [
              { model: Supply, as: 'supply' },
              { model: Area, as: 'area' },
            ],
          },
        );

        const res = await api.patch(
          `/request-supplies/${rs.id + 1}`,
          { status: 'Approved' },
          tokenAdmin,
        );
        expect(res.status).toBe(BAD_REQUEST);
        expect(res.body).toContainEntry(['status', BAD_REQUEST]);
        expect(res.body).toContainEntry([
          'message',
          'Request Supply not exists',
        ]);
      });
    });
  });

  describe('POST /request-supplies', () => {
    test('Without Token response error', async () => {
      const data = {};
      const res = await api.post('/request-supplies', data);
      expect(res).not.toBeValidToken();
    });

    describe('With Token', () => {
      test('Data Validation (empty data)', async () => {
        const data = {};
        const res = await api.post('/request-supplies', data, token);
        expect(res.status).toBe(BAD_REQUEST);
        expect(res.body).toContainEntry(['status', BAD_REQUEST]);
        expect(res.body).toContainEntry(['message', 'Validation Errors']);
        expect(res.body.errors).toIncludeAllMembers([
          'Invalid Area ID',
          'Invalid Supply ID',
        ]);
      });

      test('Data Validation (invalid data)', async () => {
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
        expect(res.body.errors).toIncludeAllMembers([
          'Invalid Area ID',
          'Invalid Supply ID',
        ]);
      });

      test('Success Request Supplies', async () => {
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
