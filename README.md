# Ambiente de EXEMPLO para express.js
[![Build Status](https://app.travis-ci.com/ismaelalvesgit/node-express-example.svg?branch=master)](https://app.travis-ci.com/ismaelalvesgit/node-express-example)

Este projeto foi criado para motivos acadêmicos para minha aprendizagem pessoal
utilizando [Node.js](https://nodejs.org/en/) e [Express](https://expressjs.com/pt-br/).

Feramentas Utilizadas:
* [NodeJs](https://nodejs.org/en/)
* [Express](https://expressjs.com/pt-br/)
* [knex](http://knexjs.org/)
* [mysql2](https://www.npmjs.com/package/mysql2)
* [dotenv](https://www.npmjs.com/package/dotenv)
* [cors](https://www.npmjs.com/package/cors)
* [joi](https://www.npmjs.com/package/@hapi/joi)
* [date-fns](https://www.npmjs.com/package/date-fns)
* [date-fns-tz](https://www.npmjs.com/package/date-fns-tz)
* [helmet](https://www.npmjs.com/package/helmet)
* [hide-powered-by](https://www.npmjs.com/package/hide-powered-by)
* [http-status-codes](https://www.npmjs.com/package/http-status-codes)
* [morgan](https://www.npmjs.com/package/morgan)
* [swagger-jsdoc](https://www.npmjs.com/package/swagger-jsdoc)
* [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express)
* [uuid](https://www.npmjs.com/package/uuid)
* [winston](https://www.npmjs.com/package/winston)
* [winston-daily-rotate-file](https://www.npmjs.com/package/winston-daily-rotate-file)
* [x-xss-protection](https://www.npmjs.com/package/x-xss-protection)
* [yamljs](https://www.npmjs.com/package/yamljs)
* [ioredis](https://www.npmjs.com/package/ioredis)
* [ramda](https://www.npmjs.com/package/ramda)
* [i18n](https://www.npmjs.com/package/i18n)
* [socket.io](https://socket.io/)
* [nodemon](https://nodemon.io/)

## Screenshots
App view:
![App UI](/app.png)

## Development

### Setup

#### 1) Instalação de dependencias
``` sh
npm i 
```
Obs: E necessario que o [NodeJs](https://nodejs.org/en/) já esteja instalado em sua máquina

#### 2) Data base
``` sh
docker-compose up -d 
```
Obs: Deixei uma aquivo de [DockerCompose](https://docs.docker.com/compose/) para que a utilização deste 
projeto seja mais simples

#### 3) Setup Data base
``` sh
npm run setup:up
```

#### 4) Iniciar Projeto
``` sh
npm run dev

# verificar a url http://localhost:3000 ou http://localhost:${customPort}
```

#### 5) Uso
Faça 2 request na rota http://localhost:3000 ou http://localhost:${customPort} e verifique o seu 
console de execução


## EXTRA
#### 1) Base de dados
Antes de iniciar qual ambiente sejá ele `LOCAL | DOCKERIZADO` deve ser criado uma base de dados no [mysql](https://www.mysql.com/) uma para o 
ambiente de DEV. Para mais informações veirifique `./src/env.js` para as variaveis de ambiente verifirifique `.env.example`

Database Name | User Database | Password Database
--------------|---------------|------------------
finance       |    `root`     | admin

#### 2) Documentação
O projeto possui uma documentação das rotas da API basta navegar para `http://localhost:3000/api-doc`, tambem deixei um arquivo localicado 
`./docker-compose.prod.yml` para facilitar os teste teste projeto.

#### 3) Criar nova migrate
Rode o comando
```sh
set NAME=teste && npm run migrate:create
```

## Contato
Desenvolvido por: [Ismael Alves](https://github.com/ismaelalvesgit)

* Email: [cearaismael1997@gmail.com](mailto:cearaismael1997@gmail.com) 
* Github: [github.com/ismaelalvesgit](https://github.com/ismaelalvesgit)
* Linkedin: [linkedin.com/in/ismael-alves-6945531a0/](https://www.linkedin.com/in/ismael-alves-6945531a0/)

### Customização de Configurações do projeto
Verifique [Configurações e Referencias](https://expressjs.com/pt-br/).
