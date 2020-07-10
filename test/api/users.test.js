const { CREATED, BAD_REQUEST } = require('http-status-codes');
const { api } = require('../test-case');
const { User } = require('../../db/models');

describe('Registry', () => {
  beforeEach(async () => {
    await User.sync({ force: true });
  });

  test('should responde 201 when create a valid user', async () => {
    const res = await api.post('/users', {
      firstName: 'Jon',
      lastName: 'Snow',
      email: 'jon.snow@winterfell.com',
      phone: '+54 11 4444-5555',
      entity: 'Hospital Alemán',
      job: 'Enfermero',
      place: 'CABA',
      pass: '1234',
    });
    expect(res.status).toBe(CREATED);
    expect(res.body).toHaveProperty('created');
    expect(res.body.created).toBe(true);
  });

  test('should responde 400 when try create user without some fields', async () => {
    const res = await api.post('/users', {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      entity: '',
      job: '',
      place: '',
      pass: '',
    });
    expect(res.status).toBe(BAD_REQUEST);
    expect(res.body).toEqual({
      created: false,
      errors: [
        'First Name is required',
        'Last Name is required',
        'E-Mail is required',
        'Phone is required',
        'Entity is required',
        'Job is required',
        'Place is required',
        'Pass is required',
      ],
    });
  });

  test('should responde 400 when try to register an email two times', async () => {
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
    let res = await api.post('/users', user);
    expect(res.status).toBe(CREATED);

    res = await api.post('/users', user);
    expect(res.status).toBe(BAD_REQUEST);
    expect(res.body).toEqual({
      created: false,
      errors: ['E-Mail address already exists'],
    });
  });
});
