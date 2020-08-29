const { printRoutes } = require('express-routes');
const app             = require('./src/server');

const port = process.env.SERVER_PORT || 9004;

app.listen(port, () => {
  console.info(`Server running on ${port}`);
  if (process.env.NODE_ENV === 'development') printRoutes(app);
});
