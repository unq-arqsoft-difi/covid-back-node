const { api } = require('./test-case');

const register = async data => api.post('/users', {
  firstName: 'Jon',
  lastName: 'Snow',
  email: 'jon.snow@winterfell.com',
  phone: '+54 11 4444-5555',
  entity: 'Hospital Alemán',
  job: 'Enfermero',
  place: 'Ciudad Autónoma de Buenos Aires',
  pass: '1234',
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

module.exports = {
  generateToken,
  login,
  register,
};
