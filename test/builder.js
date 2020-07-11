const { api } = require('./test-case');
const {
  Institution,
  Province,
  Town,
  User,
} = require('../db/models');

const createTown = async (provinceId) => {
  const id = '99';
  const name = 'Custom Town';
  const town = await Town.findOne({ where: { name } });
  if (town) return town;

  return Town.create({ id, name, provinceId });
};

const createProvince = async () => {
  const id = '99';
  const name = 'Custom Province';
  const province = await Province.findOne({ where: { name } });
  if (province) return province;

  return Province.create({ id, name });
};

const createInstitution = async (provinceId, townId) => {
  const id = '99';
  const name = 'Custom Institution';
  const funding = 'Municipal';
  const institution = await Institution.findOne({ where: { name } });
  if (institution) return institution;

  return Institution.create({
    id,
    name,
    funding,
    townId,
    provinceId,
  });
};

const register = async data => User.create({
  firstName: 'Jon',
  lastName: 'Snow',
  email: 'jon.snow@winterfell.com',
  phone: '+54 11 4444-5555',
  institutionId: null,
  provinceId: null,
  townId: null,
  job: 'Enfermero',
  pass: '1234',
  admin: false,
  ...data,
});

const login = async data => api.post('/login', {
  email: 'jon.snow@winterfell.com',
  pass: '1234',
  ...data,
});

const generateToken = async (data = {}) => {
  await register(data);
  const loginData = {};
  if (data.email) loginData.email = data.email;
  if (data.pass) loginData.pass = data.pass;
  return login(loginData).then(res => res.body.token);
};

const generateTokenAdmin = async (data = {}) => generateToken({ ...data, admin: true });

module.exports = {
  createInstitution,
  createProvince,
  createTown,
  generateToken,
  generateTokenAdmin,
  login,
  register,
};
