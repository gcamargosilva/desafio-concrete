/* eslint-disable no-undef */

const should = require('should');
const request = require('supertest');
const server = require('../../../app');

const email = `user@example${Math.ceil(Math.random() * 10000)}.com`;
let token = '';
let id = '';
describe('controllers', () => {
  describe('Cliente', function () {
    this.timeout(10000);
    it('Deve criar um cliente', (done) => {
      request(server)
        .post('/client')
        .send({
          nome: 'Gustavo',
          email,
          senha: 'teste',
          telefones: [
            {
              numero: '975919064',
              ddd: '11',
            },
          ],
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          should.exists(res.body.id);
          done();
        });
    });
  });
  describe('Auth', function () {
    this.timeout(10000);
    it('Deve realizar um login', (done) => {
      request(server)
        .post('/signin')
        .send({
          email,
          senha: 'teste',
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          id = res.body.id;
          token = res.body.token;
          should.exists(res.body.id);
          done();
        });
    });
  });
  describe('Get Client', function () {
    this.timeout(10000);
    it('Deve buscar o usuário', (done) => {
      request(server)
        .get(`/client/${id}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          should.exists(res.body.id);
          done();
        });
    });
  });
});
