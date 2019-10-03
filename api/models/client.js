const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const updatedTimestamp = require('mongoose-updated_at');

mongoose.plugin(updatedTimestamp, {
  createdAtOn: 'data_criacao',
  updatedAtOn: 'ultima_atualizacao',
});

const ClientSchema = new mongoose.Schema({
  id: String,
  nome: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  senha: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  telefones: [{ numero: String, ddd: String }],
  data_criacao: { type: Date, default: Date.now },
  ultimo_login: { type: Date, default: Date.now },
  token: String,
});


ClientSchema.methods.generateToken = function () {
  const token = jwt.sign({ id: this.id }, config.get('privateKey'), { expiresIn: '30m' });
  return token;
};

ClientSchema.methods.toJSON = function () {
  const obj = this.toObject();
  // eslint-disable-next-line no-underscore-dangle
  delete obj._id;
  // eslint-disable-next-line no-underscore-dangle
  delete obj.__v;
  return obj;
};

ClientSchema.plugin(updatedTimestamp);

const Client = mongoose.model('Client', ClientSchema);

exports.Client = Client;
