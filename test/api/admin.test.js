const { OK, BAD_REQUEST } = require('http-status-codes');
const { api, clearDatabase } = require('../test-case');
const builder = require('../builder');
const {
  Area,
  RequestSupply,
  Supply,
  User,
} = require('../../db/models');

describe('Admin Request Supplies', () => {
  let token;
  let tokenAdmin;
  let notAdminUser;
  beforeEach(async () => {
    await clearDatabase();
    token = await builder.generateToken({ email: 'juan@nieve.com' });
    notAdminUser = await User.findOne({ where: { email: 'juan@nieve.com' } });
    tokenAdmin = await builder.generateTokenAdmin({ email: 'jon@snow.com' });
  });

  describe('GET /admin/request-supplies', () => {
    test('With not Admin Token response error', async () => {
      const res = await api.get('/admin/request-supplies', token);
      expect(res).not.toBeValidToken();
    });

    describe('With Admin Token', () => {
      test('Empty list', async () => {
        const res = await api.get('/admin/request-supplies', tokenAdmin);
        expect(res.status).toBe(OK);
        expect(res.body).toBeArrayOfSize(0);
      });

      test('With data', async () => {
        await RequestSupply.create({
          userId: notAdminUser.id,
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

        const res = await api.get('/admin/request-supplies', tokenAdmin);
        expect(res.status).toBe(OK);
        expect(res.body).toBeArrayOfSize(1);
        const [reqSupply] = res.body;
        expect(reqSupply).toContainEntry(['id', 1]);
        expect(reqSupply).toContainEntry(['userId', notAdminUser.id]);
        expect(reqSupply).toContainEntry(['supplyId', 1]);
        expect(reqSupply).toContainEntry(['areaId', 1]);
        expect(reqSupply).toContainEntry(['amount', 10]);
        expect(reqSupply).toContainEntry(['status', 'Pending']);
      });

      test('Only pending', async () => {
        await RequestSupply.create({
          userId: notAdminUser.id,
          supply: { name: 'Gloves', stock: 1000 },
          area: { name: 'The Citadel' },
          amount: 30,
          status: 'Approved',
        }, {
          include: [
            { model: Supply, as: 'supply' },
            { model: Area, as: 'area' },
          ],
        });
        await RequestSupply.create({
          userId: notAdminUser.id,
          supplyId: 1,
          areaId: 1,
          amount: 20,
          status: 'Pending',
        });

        let res = await api.get('/admin/request-supplies', tokenAdmin);
        expect(res.status).toBe(OK);
        expect(res.body).toBeArrayOfSize(2);

        res = await api.get('/admin/request-supplies?status=Pending', tokenAdmin);
        expect(res.status).toBe(OK);
        expect(res.body).toBeArrayOfSize(1);

        const [reqSupply] = res.body;
        expect(reqSupply).toContainEntry(['id', 2]);
        expect(reqSupply).toContainEntry(['userId', notAdminUser.id]);
        expect(reqSupply).toContainEntry(['supplyId', 1]);
        expect(reqSupply).toContainEntry(['areaId', 1]);
        expect(reqSupply).toContainEntry(['amount', 20]);
        expect(reqSupply).toContainEntry(['status', 'Pending']);
      });
    });
  });

  describe('GET /admin/request-supplies/:id', () => {
    test('Without not Admin Token response error', async () => {
      const res = await api.get('/admin/request-supplies', token);
      expect(res).not.toBeValidToken();
    });

    describe('With Token', () => {
      test('With data', async () => {
        const rs = await RequestSupply.create({
          userId: notAdminUser.id,
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

        const res = await api.get(`/admin/request-supplies/${rs.id}`, tokenAdmin);
        expect(res.status).toBe(OK);
        expect(res.body).toBeObject();
        expect(res.body).toContainEntry(['id', 1]);
        expect(res.body).toContainEntry(['userId', notAdminUser.id]);
        expect(res.body).toContainEntry(['supplyId', 1]);
        expect(res.body).toContainEntry(['areaId', 1]);
        expect(res.body).toContainEntry(['amount', 10]);
        expect(res.body).toContainEntry(['status', 'Pending']);
      });

      test('Error when invalid id', async () => {
        const rs = await RequestSupply.create({
          userId: notAdminUser.id,
          supply: { name: 'Gloves', stock: 1000 },
          area: { name: 'The Citadel' },
          amount: 30,
          status: 'Approved',
        }, {
          include: [
            { model: Supply, as: 'supply' },
            { model: Area, as: 'area' },
          ],
        });

        const res = await api.get(`/admin/request-supplies/${rs.id + 1}`, tokenAdmin);
        expect(res.status).toBe(BAD_REQUEST);
        expect(res.body).toContainEntry(['status', BAD_REQUEST]);
        expect(res.body).toContainEntry(['message', 'Request Supply not exists']);
      });
    });
  });

  describe('PUT /request-supplies/:id/approve', () => {
    test('Without Token response error', async () => {
      const res = await api.put('/admin/request-supplies/1/approve', {}, token);
      expect(res).not.toBeValidToken();
    });

    describe('With Token', () => {
      test('Approve when is Pending', async () => {
        const rs = await RequestSupply.create({
          userId: notAdminUser.id,
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

        let res = await api.get(`/admin/request-supplies/${rs.id}`, tokenAdmin);
        expect(res.status).toBe(OK);
        expect(res.body).toContainEntry(['status', 'Pending']);

        res = await api.put(`/admin/request-supplies/${rs.id}/approve`, {}, tokenAdmin);
        expect(res.status).toBe(OK);
        expect(res.body).toBeObject();
        expect(res.body).toContainEntry(['status', 'Approved']);
        expect(res.body).toContainEntry(['id', 1]);
        expect(res.body).toContainEntry(['userId', notAdminUser.id]);
        expect(res.body).toContainEntry(['supplyId', 1]);
        expect(res.body).toContainEntry(['areaId', 1]);
        expect(res.body).toContainEntry(['amount', 10]);
      });

      test('Error when id not Pending', async () => {
        const rs = await RequestSupply.create({
          userId: notAdminUser.id,
          supply: { name: 'Gloves', stock: 1000 },
          area: { name: 'The Citadel' },
          amount: 30,
          status: 'Canceled',
        }, {
          include: [
            { model: Supply, as: 'supply' },
            { model: Area, as: 'area' },
          ],
        });

        const res = await api.put(`/admin/request-supplies/${rs.id}/approve`, {}, tokenAdmin);
        expect(res.status).toBe(BAD_REQUEST);
        expect(res.body).toContainEntry(['status', BAD_REQUEST]);
        expect(res.body).toContainEntry(['message', 'Request Supply is not Pending']);
      });

      test('Error when invalid id', async () => {
        const rs = await RequestSupply.create({
          userId: notAdminUser.id,
          supply: { name: 'Gloves', stock: 1000 },
          area: { name: 'The Citadel' },
          amount: 30,
          status: 'Approved',
        }, {
          include: [
            { model: Supply, as: 'supply' },
            { model: Area, as: 'area' },
          ],
        });

        const res = await api.put(`/admin/request-supplies/${rs.id + 1}/approve`, {}, tokenAdmin);
        expect(res.status).toBe(BAD_REQUEST);
        expect(res.body).toContainEntry(['status', BAD_REQUEST]);
        expect(res.body).toContainEntry(['message', 'Request Supply not exists']);
      });
    });
  });

  describe('PUT /request-supplies/:id/reject', () => {
    test('Without Token response error', async () => {
      const res = await api.put('/admin/request-supplies/1/reject', {}, token);
      expect(res).not.toBeValidToken();
    });

    describe('With Token', () => {
      test('Reject when is Pending', async () => {
        const rs = await RequestSupply.create({
          userId: notAdminUser.id,
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

        let res = await api.get(`/admin/request-supplies/${rs.id}`, tokenAdmin);
        expect(res.status).toBe(OK);
        expect(res.body).toContainEntry(['status', 'Pending']);

        res = await api.put(`/admin/request-supplies/${rs.id}/reject`, {}, tokenAdmin);
        expect(res.status).toBe(OK);
        expect(res.body).toBeObject();
        expect(res.body).toContainEntry(['status', 'Rejected']);
        expect(res.body).toContainEntry(['id', 1]);
        expect(res.body).toContainEntry(['userId', notAdminUser.id]);
        expect(res.body).toContainEntry(['supplyId', 1]);
        expect(res.body).toContainEntry(['areaId', 1]);
        expect(res.body).toContainEntry(['amount', 10]);
      });

      test('Error when id not Pending', async () => {
        const rs = await RequestSupply.create({
          userId: notAdminUser.id,
          supply: { name: 'Gloves', stock: 1000 },
          area: { name: 'The Citadel' },
          amount: 30,
          status: 'Approved',
        }, {
          include: [
            { model: Supply, as: 'supply' },
            { model: Area, as: 'area' },
          ],
        });

        const res = await api.put(`/admin/request-supplies/${rs.id}/reject`, {}, tokenAdmin);
        expect(res.status).toBe(BAD_REQUEST);
        expect(res.body).toContainEntry(['status', BAD_REQUEST]);
        expect(res.body).toContainEntry(['message', 'Request Supply is not Pending']);
      });

      test('Error when invalid id', async () => {
        const rs = await RequestSupply.create({
          userId: notAdminUser.id,
          supply: { name: 'Gloves', stock: 1000 },
          area: { name: 'The Citadel' },
          amount: 30,
          status: 'Approved',
        }, {
          include: [
            { model: Supply, as: 'supply' },
            { model: Area, as: 'area' },
          ],
        });

        const res = await api.put(`/admin/request-supplies/${rs.id + 1}/reject`, {}, tokenAdmin);
        expect(res.status).toBe(BAD_REQUEST);
        expect(res.body).toContainEntry(['status', BAD_REQUEST]);
        expect(res.body).toContainEntry(['message', 'Request Supply not exists']);
      });
    });
  });
});
