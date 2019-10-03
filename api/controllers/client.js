const uuid = require('uuid');
const bcrypt = require('bcrypt');
const { Client } = require('../models/client');

async function post(req, res) {
  const clientRequest = req.swagger.params.client.value;
  let client = await Client.findOne({ email: clientRequest.email });

  if (client) return res.status(400).send({ message: 'E-mail já existente' });

  client = new Client({ ...clientRequest });
  client.id = uuid();
  client.token = client.generateToken();

  client.senha = await bcrypt.hash(clientRequest.senha, 10);

  await client.save();
  // Delete MongoDb Id
  // eslint-disable-next-line no-underscore-dangle
  delete client._id;

  return res.status(200).send(client);
}

async function get(req, res) {
  const { infoToken } = req;
  const clientId = req.swagger.params.clientId.value;

  if (!infoToken) return res.status(403).send({ message: 'Não autorizado' });
  if (clientId !== infoToken.id) return res.status(403).send({ message: 'Não autorizado' });

  const client = await Client.findOne({ id: clientId });
  return res.status(200).send(client);
}

// Adjust for async functions in swagger-node
exports.post = function (req, res, next) { post(req, res).then().catch((err) => next(err)); };
exports.get = function (req, res, next) { get(req, res).then().catch((err) => next(err)); };
