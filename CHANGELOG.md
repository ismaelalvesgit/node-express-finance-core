# Change Log
Todas as mudanças notáveis ​​neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](http://keepachangelog.com/)
e este projeto adere a [Semantic Versioning](http://semver.org/).

## Ongoing changes
### Added
- Job`s foi movido para outro micro-serviço
- Adicionado novo job pra pegar preço de cripto ativos
- Adicionado o campo "currency" em investment, dividends
- Melhorado sistema de logger
- Adicionado rotas /bcb/bdrx, /bcb/sp500, /bcb/boundList, /bcb/bound/:code
- Adicionado rotas /bcb/ibovespa, /bcb/ifix, /bcb/ipca, /bcb/cdi
- Adicionado nova rota /bcb
- Adicionado novo job pra sincronização do balance
- Adicionado nova rota /currency
- Adicionado novo job para colhimento de valores de moedas
- Adicionado nova estrutura de jobs
- Adicionado broker nos dividendos
- Adicionado nova integração de API de noticias
- Atualizado update balance
- Foi adicionado a rota /events
- Adicionado novo job para colhimento de eventos corporativos (AÇÃO, FIIS)
- Adicionado novo jobs pra auto dividens (AÇÃO, FIIS, ETF, REITS, STOKES)
- Adicionado novo job pra atualização de valores de ativos exteriores
- Adicionado nova integração com yahoo finace e iexclound api
- Adicionado novo job para envio de altas / baixas dos investimentos cadastrados
- Adicionado função `jsonObjectArrayQuerySelect` em utils
- Adicionado função `jsonObjectQuerySelect` em utils
- Adicionado campos para imposto em transações
- Adicionado cronjob de backup de dados
- Adicionado nova rota /investment
- Adicionado lint no test
- Atualizado Colunas da tabela de investment
- Adicionado job de sincronização de proventos FIIS e AÇÕES
- Atualizado documentação
- Atualização docker-compose.prod e docker-compose
- Job de atualização de dividendos
- Job de atualização de valores criado
- Socket configurado
- Foi adicionado as rota /transaction
- Foi adicionado as rota /broker
- Foi adicionado as rota /category
- Foi adicionado as rota /system

### Fixed
### Changed
