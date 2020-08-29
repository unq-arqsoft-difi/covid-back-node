const { CREATED, BAD_REQUEST } = require('http-status-codes').StatusCodes;
const { api, clearDatabase } = require('../test-case');
const builder = require('../builder');

describe('Registry', () => {
  beforeEach(async () => clearDatabase());

  test('should responde 201 when create a valid user', async () => {
    const province = await builder.createProvince();
    const town = await builder.createTown(province.id);
    const institution = await builder.createInstitution(province.id, town.id);
    const res = await api.post('/users', {
      firstName: 'Jon',
      lastName: 'Snow',
      email: 'jon.snow@winterfell.com',
      phone: '+54 11 4444-5555',
      institutionId: institution.id,
      provinceId: province.id,
      townId: town.id,
      job: 'Enfermero',
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
      job: '',
      pass: '',
    });
    expect(res.status).toBe(BAD_REQUEST);
    expect(res.body).toBeObject();
    expect(res.body).toContainEntry(['status', BAD_REQUEST]);
    expect(res.body).toContainEntry(['message', 'User not created']);
    expect(res.body.errors).toIncludeAllMembers([
      'First Name is required',
      'Last Name is required',
      'E-Mail is required',
      'Phone is required',
      'Job is required',
      'Pass is required',
      'Invalid Institution ID',
      'Invalid Province ID',
      'Invalid Town ID',
    ]);
  });

  test('should responde 400 when try to register an email two times', async () => {
    const province = await builder.createProvince();
    const town = await builder.createTown(province.id);
    const institution = await builder.createInstitution(province.id, town.id);
    const user = {
      firstName: 'Jon',
      lastName: 'Snow',
      email: 'jon.snow@winterfell.com',
      phone: '+54 11 4444-5555',
      institutionId: institution.id,
      provinceId: province.id,
      townId: town.id,
      job: 'Enfermero',
      pass: '1234',
    };
    let res = await api.post('/users', user);
    expect(res.status).toBe(CREATED);

    res = await api.post('/users', user);
    expect(res.status).toBe(BAD_REQUEST);
    expect(res.body).toBeObject();
    expect(res.body).toContainEntry(['status', BAD_REQUEST]);
    expect(res.body).toContainEntry(['message', 'User not created']);
    expect(res.body.errors).toIncludeAllMembers(['E-Mail address already exists']);
  });
});
