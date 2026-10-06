# Base de Dados - PaliVida

Este diretório contém os scripts necessários para configurar a base de dados local do projeto **PaliVida** utilizando o MySQL 8.4.

## Estrutura de Ficheiros
- `schema.sql`: Script responsável por criar o schema `palivida`, as 7 tabelas, chaves primárias, chaves estrangeiras, índices e restrições (como a escala de intensidade de 0 a 10).
- `seed.sql`: Script de povoamento com dados fictícios e seguros para testes iniciais de desenvolvimento.

## Como Utilizar no Ambiente Local
1. Abra o **MySQL Workbench** e abra a sua conexão local (`PaliVida Local`).
2. Abra e execute o ficheiro `schema.sql` para criar toda a estrutura da base de dados.
3. Abra e execute o ficheiro `seed.sql` para popular a base de dados com dados de teste.