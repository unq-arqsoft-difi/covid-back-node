const { printRoutes } = require('@leandrojdl/express-routes');
const app             = require('./src/server');

const port = process.env.SERVER_PORT || 9004;
const domain = process.env.SERVER_DOMAIN || 'localhost';

app.listen(port, domain, () => {
  console.info(`Server running on http://${domain}:${port}`);
  if (process.env.NODE_ENV === 'development') printRoutes(app);
});
