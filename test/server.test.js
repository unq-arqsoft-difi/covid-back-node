const { NOT_FOUND } = require('http-status-codes').StatusCodes;
const { api } = require('./test-case');

describe('Server', () => {
  test('Should response 404 when request for an non-existing route', async () => {
    const res = await api.get('/invalidURL');
    expect(res.status).toBe(NOT_FOUND);
  });
});
