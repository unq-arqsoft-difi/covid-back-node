require('dotenv').config({ path: `${__dirname}/../.env.test` });
const request = require('supertest');
const { CREATED } = require('http-status-codes');
const app = require('../../src/server');

describe('Registry', () => {
  it('should responde 201 when create a valid user', async () => {
    const res = await request(app)
      .post('/registry')
      .send({
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

  it('should responde 400 when try create user without some fields', async () => {
    const res = await request(app)
      .post('/registry')
      .send({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        entity: '',
        job: '',
        place: '',
        pass: '',
      });
    expect(res.status).toBe(400);
    expect(res.body).toEqual(
      {
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
      },
    );
  });
});
