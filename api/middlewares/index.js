
const jwt = require('jsonwebtoken');
const config = require('config');

exports.UrlNotFound = function (req, res) {
  return res.status(404).json({ message: 'Path not found' });
};

exports.ErrorHandler = function (error, req, res) {
  if (error && error.message) {
    res.status(500).send({
      message: error.message,
    });
  } else {
    res.status(500).send({
      message: 'Internal server error',
    });
  }
};

exports.ErroSwaggerHandler = function (error, req, res, next) {
  if (error && error.code === 'SCHEMA_VALIDATION_FAILED') {
    if (error.results && error.results.errors.length > 0) {
      res.status(422).send({ message: `${error.results.errors[0].path[0]} : ${error.results.errors[0].message}` });
    } else {
      next(error);
    }
  } else {
    next(error);
  }
};

exports.AuthorizationMiddleware = function (req, res, next) {
  const { token } = req;
  if (!token) return next();
  try {
    const infoToken = jwt.verify(token, config.get('privateKey'));
    req.infoToken = infoToken;
    return next();
  } catch (error) {
    switch (error.name) {
      case 'TokenExpiredError':
        return res.status(403).send({ message: 'Sessão inválida' });
      default:
        return res.status(403).send({ message: 'Não autorizado' });
    }
  }
};
