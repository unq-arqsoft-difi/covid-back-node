const morgan      = require('morgan');
const logger      = require('winston-ready');
const app         = require('./src/server');

const PORT = process.env.SERVER_PORT || 9004;

// Middleware for express
app.use(morgan('common', { stream: { write: message => logger.verbose(message) } }));


app.listen(PORT, () => {
  logger.info('Server running on port %d', PORT);
});
