require('jest-extended');
const { UNAUTHORIZED } = require('http-status-codes');

expect.extend({
  toBeValidToken(res) {
    const expectedBody = { status: UNAUTHORIZED, message: 'Invalid Token' };
    const passHeader = res.status !== UNAUTHORIZED;
    const passBody = res.body.status !== expectedBody.status && res.body.message !== expectedBody.message;

    if (!passHeader) {
      return {
        message: () => `expected status not to be ${UNAUTHORIZED}`,
        pass: false,
      };
    }
    if (!passBody) {
      return {
        message: () => `expected body not to be ${expectedBody.toString()}`,
        pass: false,
      };
    }
    return {
      message: () => `expected status to be ${UNAUTHORIZED} and body to ${expectedBody.toString()}`,
      pass: true,
    };
  },
});
