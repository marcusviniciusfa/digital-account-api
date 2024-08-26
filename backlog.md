
<div align="center">
  <h1>Backlog</h1>
  <p>O que foi ambicionado para o projeto e o concluído até o presente momento</p>
  <hr>
  <a href="README.md">home</a> • <a>backlog</a>
  <hr>
</div>


### Essencial

- [x] Desenvolver o projeto guiado por testes (**TDD**)
- [x] Estruturar a aplicação com **Arquitetura Hexagonal**
	- [x] Adicionar o padrão **Repository** do **DDD**
	- [x] Criar **DTOs** para entrada e saída de dados nos **Casos de Uso**
	- [x] Criar **Casos de Uso** com **Testes de Integração**
- [x] Adicionar banco de dados **PostgreSQL** com **Prisma ORM**
- [x] Criar **rotas HTTP** com **Express.js** para interagir com os **Casos de Uso**
  - [x] Criar um CRUD de **Portadores** de contas digitais
	- [x] Criar uma rota para criar um **Portador**
	- [x] Criar uma rota para buscar um **Portador**
	- [x] Criar uma rota para atualizar um **Portador**
	- [x] Criar uma rota para deletar **Portador**
- [x] Criar um CRUD de **Contas Digitais**
  - [x] Criar uma rota para criar uma **Conta Digital**
  - [x] Criar uma rota para buscar uma **Conta Digital**
  - [x] Criar uma rota para deletar (desativar) uma **Conta Digital**
- [x] Criar uma rota para bloquear uma **Conta Digital**
- [x] Criar uma rota para desbloquear uma **Conta Digital**
- [x] Criar uma rota para realizar um deposito na **Conta Digital**
- [x] Criar uma rota para realizar um saque na **Conta Digital**
- [x] Criar uma rota para consultar extrato de uma **Conta Digital**
- [x] Organizar estrutura de pastas
- [x] Adicionar **docker-compose** para orquestrar o Banco de Dados e o Servidor
- [x] ~~Documentar com o **Swagger/Open API**~~ Documentar com o **Postman**

### Bônus

- [ ] Adicionar validação de entrada com o **Zod**
- [ ] Criar **Controllers** para as rotas segregar as rotas e isolar a tratativa dos dados de entrada
- [ ] Criar **Entidades** de domínio
- [ ] Adicionar tratativa de sucesso ou falha na API com o padrão como o **Either**
- [ ] Adicionar padrão **RFC 7807 (Problem Details)** para respostas de erro (400, 404, 500, etc)
- [ ] Adicionar autenticação com **JWT**
- [ ] Preparar o projeto para também executar na **AWS**
	- [ ] Adicionar **handlers** no formato para **Lambdas**
	- [ ] Adicionar **SST** (IaC) para criar os serviços na **AWS**
- [ ] Adicionar o **tsyring**, da Microsoft, para fazer injeção de dependências
- [ ] Adicionar internacionalização de mensagens de erro com **i18n**
