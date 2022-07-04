# Ambiente de EXEMPLO para express.js
[![Build Status](https://app.travis-ci.com/ismaelalvesgit/node-express-finance-core.svg?branch=master)](https://app.travis-ci.com/ismaelalvesgit/node-express-finance-core)

Este projeto foi criado para motivos acadêmicos para minha aprendizagem pessoal
utilizando [Node.js](https://nodejs.org/en/) e [Express](https://expressjs.com/pt-br/). 

Depedencia operacional:
- [jobs](https://github.com/ismaelalvesgit/node-express-finance-job)

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

#### 3) Setup Data base and Initial Data
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

#### 4) Email Config
Estarei deixando o link do [appMenosSeguro](https://myaccount.google.com/u/2/lesssecureapps) que necessita estar 
habilitado para utilização do serviço de envio de email padrão. Para utilizar os serviços de email com OAuth2 siga 
os proximos passo [link](https://dev.to/chandrapantachhetri/sending-emails-securely-using-node-js-nodemailer-smtp-gmail-and-oauth2-g3a).

#### 5) Collection Postman
Estarei deixando uma collection da ferramenta [Postman](https://www.postman.com/) para facilitação de testes manuais. 😁😁😁

## Contato
Desenvolvido por: [Ismael Alves](https://github.com/ismaelalvesgit) 🤓🤓🤓

* Email: [cearaismael1997@gmail.com](mailto:cearaismael1997@gmail.com) 
* Github: [github.com/ismaelalvesgit](https://github.com/ismaelalvesgit)
* Linkedin: [linkedin.com/in/ismael-alves-6945531a0/](https://www.linkedin.com/in/ismael-alves-6945531a0/)

### Customização de Configurações do projeto
Verifique [Configurações e Referencias](https://expressjs.com/pt-br/).
