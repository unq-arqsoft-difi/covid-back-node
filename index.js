const morgan          = require('morgan');
const logger          = require('winston');
const { printRoutes } = require('@leandrojdl/express-routes');
const app             = require('./src/server');

const PORT = process.env.SERVER_PORT || 9004;

// Middleware for express
app.use(morgan('common', { stream: { write: message => logger.verbose(message) } }));

app.listen(PORT, () => {
  logger.info('Server running on port %d', PORT);
  if (process.env.NODE_ENV === 'development') {
    printRoutes(app);
  }
});
