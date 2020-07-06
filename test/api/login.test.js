const { OK, BAD_REQUEST } = require('http-status-codes');
const { api } = require('../test-case');
const { User } = require('../../db/models');

describe('Auth', () => {
  beforeEach(async () => {
    await User.sync({ force: true });
  });

  it('should response 200 when login is successfully', async () => {
    const user = {
      firstName: 'Jon',
      lastName: 'Snow',
      email: 'jon.snow@winterfell.com',
      phone: '+54 11 4444-5555',
      entity: 'Hospital Alemán',
      job: 'Enfermero',
      place: 'CABA',
      pass: '1234',
    };
    await User.create(user);
    const res = await api.post('/login', {
      email: user.email,
      pass: user.pass,
    });
    expect(res.status).toBe(OK);
    expect(res.body).toHaveProperty('token');
  });

  it('should response 400 when login has invalid email', async () => {
    const res = await api.post('/login', {
      email: 'jon.snow@winterfell.com',
      pass: '1234',
    });
    expect(res.status).toBe(BAD_REQUEST);
    expect(res.body).toEqual(
      {
        token: false,
        errors: ['Invalid email or password'],
      },
    );
  });

  it('should response 400 when login has invalid pass', async () => {
    const res = await api.post('/login', {
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
