# 📊 node-express-finance-core
API REST para gerenciamento de informações financeiras, com foco em FIIs, FII AGRO, FIP(Fundo de Investimento em Participações), FIA(Fundos de Investimentos de Ações), FIDC(Fundo de Investimento em Direitos Creditórios), FIINFRA(Fundo de investimento em infraestrutura), Fundo Setorial, Ações, Criptomoedas, ETFs (nacionais e estrangeiros), além de controle de carteira de investimentos. Projeto modular, escalável e pronto para produção.
utilizando [Node.js](https://nodejs.org/en) e [Express.js](https://expressjs.com/pt-br/). 

# ✨ Funcionalidades
- 🔍 Consulta de informações sobre:
  - **FII**(Fundos Imobiliários), **FII AGRO**(Fundos de Agronegócio), **FIP**(Fundo de Investimento em Participações), **FIA**(Fundos de Investimentos de Ações), **FIDC**(Fundo de Investimento em Direitos Creditórios), **FIINFRA**(Fundo de investimento em infraestrutura), **Fundo Setorial**
  - **Ações** (BR e exterior)
  - **Criptomoedas**
  - **ETFs** e **REITs**
- 📊 Gerenciamento de carteira de investimentos
- 🔁 Importação e atualização de cotações
- 📦 Estrutura modular e reutilizável para múltiplos tipos de ativo
- 🌍 Noticias sobre mercado financeiro e BACEN
- 🏛️ Histórico de indices **IFIX**, **BDRX**, **S&P500**, **IBOVESPA**, **CDI**, **IPCA**
- 📁 Base em Mysql com [knex.js](https://knexjs.org/)
- 🧪 Testes com Jest
- 🚀 Pronto para deploy com Docker
- 🌐 Suporte Multilíngue (i18n)
- 📈 Monitoramento & Observabilidade


# 🚀 Como rodar o projeto
Pré-requisitos
- [Node.js](https://nodejs.org/en)
- Docker e Docker Compose
- Mysql (caso não use Docker)
- 
### 1. Clone o repositório:
```bash
git clone https://github.com/ismaelalvesgit/node-express-finance-core.git
```

### 2. Navegue até o diretório do projeto:
```bash
cd node-express-finance-core
```

### 3. Instale as dependências:
```bash
npm install
```

### 4. Com docker:
```bash
docker-compose up -d
```

### 5. Executando...:
```bash
npm run dev
```

# 🌐 Suporte Multilíngue (i18n)
O projeto possui suporte a múltiplos idiomas através da integração com o pacote i18n, possibilitando respostas mais amigáveis e localizadas, dependendo do idioma requisitado pelo cliente.

## ✅ Características:
- Traduções organizadas em arquivos separados por idioma (locales/)
- Idioma definido por Accept-Language no header da requisição
- Mensagens padronizadas para erros, logs e respostas da API
- Fácil de estender para novos idiomas

# 🛠️ Uso

### 1. QueryData
Criei uma forma simples de realizar pesquisas do dados nos endpoint´s paginados

Name | Description | Data
-----|-------------|------------------
page               | Página atual | default: 1
pageSize           | Quantidades de itens por Página | default: 10
orderBy            | Ordenação por atributo | default: ASC
orderByDescending  | Tipo de ordenação | default: false => true=DESC, false=ASC 
filterBy           | filtro de itens | default: empty => "Property" "Condition" "Value"

## 2. FilterBy
Condition          | Values               | Exemple
-------------------|----------------------|------------------
Equal              | "eq" or "Eq" or "EQ" | name eq Ismael
NotEqual           | "ne" or "Ne" or "NE" | name ne Ismael
GreaterThan        | "gt" or "Gt" or "GT" | price gt 10
GreaterThanOrEqual | "ge" or "Ge" or "GE" | price ge 10
LessThan           | "lt" or "Lt" or "LT" | price lt 10
LessThanOrEqual    | "le" or "Le" or "LE" | price le 10
In                 | "In" or "in" or "IN" | name in Ismael,Raquel
Like               | "lk" or "Lk" or "LK" | name lk ismael (only string columns)

# 🚀 Tipos de deploys pre-configurados

# 🐳 Docker
```bash
docker build -t finance-core .
docker run finance-core
```

# ![Helm](https://img.shields.io/badge/Helm-0F1689?style=for-the-badge&logo=helm&logoColor=white)
Deixei configurado o [helm](https://helm.sh/) para que sejá possivel trabalhar com [kubernetes](https://kubernetes.io/pt-br/).

### 1. Helm Values
```yml
replicaCount: 1 # Number of pod´s running

image:
  repository: ismaelalvesdoc/node-express-finance-core # Repository name
  tag: latest # Version Tag
  pullPolicy: Always # Policy of download image
  livenessPath: /api/v1/healthcheck # Router (Healthcheck)

service:
  enabled: true # Service enable
  type: NodePort # Type service

ingress: 
  enabled: false # Ingress enable (Nginx)
  host: ingress.local # Host ingress
  rewrite: / # Proxy of pod´s routers

env: # Enviroment´s of service (Not encript)
  APM_SERVER_URL: "http://localhost:8200" # Name of enviroment and Value of envriroment 

secret: # Enviroment´s of service (Encript)
  DB_PASSWORD: "admin" # Name of enviroment and Value of envriroment 

resources: # Resources of pod´s
  requests: # Provisined
    memory: "700Mi" 
    cpu: 400m
  limits: # Limit of scale vertical
    memory: "1Gi"
    cpu: 800m

autoscaling: # Auto Scaling (Horizontal)
  enabled: true # Auto Scaling enable 
  minReplicas: 1 # Minimal replica count
  maxReplicas: 10 # Maximal replica count
  metrics: # Target´s of auto scaling
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 60
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 70
        
```

# 📫 Contribuições
Sinta-se à vontade para abrir issues ou enviar pull requests. Sugestões são sempre bem-vindas!

# 🤓 Contato
Desenvolvido por: [Ismael Alves](https://github.com/ismaelalvesgit) 🤓🤓🤓

* Email: [cearaismael1997@gmail.com](mailto:cearaismael1997@gmail.com) 
* Github: [github.com/ismaelalvesgit](https://github.com/ismaelalvesgit)
* Linkedin: [linkedin.com/in/ismael-alves-6945531a0/](https://www.linkedin.com/in/ismael-alves-6945531a0/)
