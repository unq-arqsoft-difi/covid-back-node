require('jest-extended');
const Ajv = require('ajv');

const ajv = new Ajv({ logger: console });

expect.extend({
  toBeValidSchema(item, schema) {
    const isValid = ajv.validate(schema, item);
    return {
      message: () => (isValid ? '' : `AJV Error: ${ajv.errorsText()}`),
      pass: isValid,
    };
  },
});
