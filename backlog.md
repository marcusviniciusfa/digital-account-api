<div align="center">
  <h1>Backlog</h1>
  <p ></p>
</div>

### Essencial

- [ ] Desenvolver o projeto guiado por testes (**TDD**)
- [ ] Criar um CRUD de **Portadores**
  - [ ] Criar uma rota para criar um **Portador**
  - [ ] Criar uma rota para buscar um **Portador**
  - [ ] Criar uma rota para atualizar um **Portador**
  - [ ] Criar uma rota para deletar **Portador**
- [ ] Criar um CRUD de **Contas Digitais**
  - [ ] Criar uma rota para criar uma **Conta Digital**
  - [ ] Criar uma rota para buscar uma **Conta Digital**
  - [ ] Criar uma rota para atualizar uma **Conta Digital**
  - [ ] Criar uma rota para deletar ("fechar") uma **Conta Digital**
- [ ] Criar uma rota para consultar extrato de uma **Conta Digital**
- [ ] Criar uma rota para bloquear uma **Conta Digital**
- [ ] Estruturar a aplicação com **Arquitetura Hexagonal**
  - [ ] Criar interfaces para os interagir atores de entrada (primary actors) e de saída (secondary actors) interagirem com a aplicação
  - [ ] Adicionar o padrão **Repository** do **DDD**
  - [ ] Criar **Casos de Uso** com **Testes de Integração**
  - [ ] Organizar estrutura de pastas (apenas para melhorar a visualização)
- [ ] Criar **Controllers** para interagir com os **Casos de Uso**
- [ ] Documentar com o **Swagger/Open API**
- [ ] Adicionar **docker-compose** para orquestrar o Banco de Dados e o Servidor

### Bônus

- [ ] Adições de bônus
  - [ ] Preparar o projeto para executar na **AWS**
    - [ ] Adicionar **handlers** no formato para **Lambdas**
    - [ ] Adicionar **SST** para criar os serviços na **AWS**
  - [ ] Adicionar validação de entrada com o **Zod**
  - [ ] Adicionar autenticação com **JWT**
  - [ ] Adicionar o **Prisma ORM**
  - [ ] Adicionar internacionalização de mensagens de erro com **i18n**
  - [ ] Adicionar padrão **RFC 7807 (Problem Details)** para respostas de erro
  - [ ] Adicionar tratativa de sucesso ou falha na API com o padrão como o **Either**
