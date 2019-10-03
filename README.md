
# Desafio Concrete

Crie um aplicativo backend que exporá uma API RESTful de criação de sing up/sign in.

## Tecnologias utilizadas

  

- NodeJs

- Express

- Swagger

- Mongoose

- JWT
- AWS Elastic BeanStalk
- Mongo Atlas

## Links

  

**Documentação**

http://desafio-cs.us-east-1.elasticbeanstalk.com/docs/

  

## Referência de desenvolvimento

  

Executar o projeto:

  

npm run start

Obs: Esse comando também realiza a validação do Lint

  

Executa os testes:

Descomentar ` module.exports = app;`do arquivo api/app.js

  

npm run test

  

## Endpoints

  

**POST /client**

Cria um cliente na base de dados, o token é um JWT que carrega um Id e sua data de expiração de 30 minutos

  

Para que a ultima atualização e criação seja setada automaticamente é utilizado um plugin do Mongoose chamado: `mongoose-updated_at`

  

ORM's como Sequelize já realizam essa atualização automaticamente.

  

**POST /SignIn**

Caso o não esteja expirado, retorna o usuário com o mesmo token, caso o token já esteja expirado, é gerado um novo, e então retornado ao usuário.

  

**GET /client/{clientID}**

Um middleware realiza a validação do token, caso o token seja válido é encaminhado a controller, essa validação não necessita de uma consulta no banco pois o JSON do token é imutável ligado a private key.

  

Após a validação o token é passado para controller aonde é verificado se o clientId passado corresponde ao clientId passado no Path, e só então a consulta no banco é realizada para recuperar o cliente.

  

É utilizada as validações de autorização pelo JWT, isso poupa recurso, pois se o token for inválido, nenhuma consulta é realizada.
