const { OK, BAD_REQUEST } = require('http-status-codes').StatusCodes;
const { api, clearDatabase } = require('../test-case');
const { User } = require('../../db/models');

describe('Auth', () => {
  beforeEach(async () => clearDatabase());

  test('should response 200 when session is successfully created', async () => {
    const user = {
      firstName: 'Jon',
      lastName: 'Snow',
      email: 'jon.snow@winterfell.com',
      phone: '+54 11 4444-5555',
      job: 'Enfermero',
      pass: '1234',
    };
    await User.create(user);
    const res = await api.post('/session', {
      email: user.email,
      pass: user.pass,
    });
    expect(res.status).toBe(OK);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('admin');
    expect(res.body.admin).toEqual(null);
  });

  test('should response 400 when session creation has invalid email', async () => {
    const res = await api.post('/session', {
      email: 'jon.snow@winterfell.com',
      pass: '1234',
    });
    expect(res.status).toBe(BAD_REQUEST);
    expect(res.body).toEqual({
      token: false,
      errors: ['Invalid email or password'],
    });
  });

  test('should response 400 when session creation has invalid pass', async () => {
    const res = await api.post('/session', {
      email: 'jon.snow@winterfell.com',
      pass: '1234',
    });
    expect(res.status).toBe(BAD_REQUEST);
    expect(res.body).toEqual({
      token: false,
      errors: ['Invalid email or password'],
    });
  });
});
