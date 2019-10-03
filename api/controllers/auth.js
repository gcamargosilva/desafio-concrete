const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('config');


const { Client } = require('../models/client');

async function auth(req, res) {
  const signIn = req.swagger.params.signIn.value;

  const client = await Client.findOne({ email: signIn.email });

  if (!client) return res.status(404).send({ message: 'Usuário e/ou senha inválidos' });

  const isValidPassword = await bcrypt.compare(signIn.senha, client.senha);

  if (!isValidPassword) return res.status(401).send({ message: 'Usuário e/ou senha inválidos' });

  try {
    jwt.verify(client.token, config.get('privateKey'));
    return res.status(200).send(client);
  } catch (error) {
    client.token = client.generateToken();
    await client.save();

    // Delete MongoDb Id
    // eslint-disable-next-line no-underscore-dangle
    delete client._id;
    return res.status(200).send(client);
  }
}

// Adjust for async functions in swagger-node
exports.auth = function (req, res, next) { auth(req, res).then().catch((err) => next(err)); };
