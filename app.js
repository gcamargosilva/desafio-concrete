
const SwaggerExpress = require('swagger-express-mw');
const swaggerUi = require('swagger-ui-express');
const app = require('express')();
const mongoose = require('mongoose');
const YAML = require('yamljs');
const bearerToken = require('express-bearer-token');

const {
  UrlNotFound, ErrorHandler, ErroSwaggerHandler, AuthorizationMiddleware,
} = require('./api/middlewares');

const db = process.env.CONNECTION_DB || 'mongodb+srv://master:Gutoca@77@cluster0-shscs.mongodb.net/test?retryWrites=true&w=majority';
const swaggerDocument = YAML.load('./api/swagger/swagger.yaml');

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true });


const config = {
  appRoot: __dirname,
};

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(bearerToken());
app.use(AuthorizationMiddleware);

// for testing
// module.exports = app;

SwaggerExpress.create(config, (err, swaggerExpress) => {
  if (err) { throw err; }

  swaggerExpress.register(app);
  app.use(UrlNotFound);
  app.use(ErroSwaggerHandler);
  app.use(ErrorHandler);

  const port = process.env.PORT || 10010;
  // eslint-disable-next-line no-console
  console.log('App Running');
  app.listen(port);
});
