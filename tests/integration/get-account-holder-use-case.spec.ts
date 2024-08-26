import { CreateAccountHolderUseCase, GetAccountHolderUseCase } from '@src/application/use-cases/account-holder';
import { AccountHolderRepositoryPort } from '@src/ports';
import { randomUUID } from 'crypto';
import { AccountHolderFakeRepository } from 'tests/database/repositories';
import { DtoFactoryHelper } from 'tests/helpers/dto-factory-helper';

describe('get an account holder use case', () => {
  let accountHolderRepository: AccountHolderRepositoryPort;
  let createAccountHolderUseCase: CreateAccountHolderUseCase;
  let getAccountHolderUseCase: GetAccountHolderUseCase;

  beforeEach(() => {
    accountHolderRepository = new AccountHolderFakeRepository();
    createAccountHolderUseCase = new CreateAccountHolderUseCase(accountHolderRepository);
    getAccountHolderUseCase = new GetAccountHolderUseCase(accountHolderRepository);
  });

  it('should get a holder', async () => {
    //given
    const accountHolder = DtoFactoryHelper.makeCreateAccountHolderInput();
    const createdAccountHolder = await createAccountHolderUseCase.execute(accountHolder);

    //when
    const accountHolderFound = await getAccountHolderUseCase.execute({ id: createdAccountHolder.id });

    //then
    expect(accountHolderFound).toHaveProperty('name', accountHolder.name);
    expect(accountHolderFound).toHaveProperty('cpf', accountHolder.cpf);
    expect(accountHolderFound).toHaveProperty('id', expect.any(String));
    expect(accountHolderFound).toHaveProperty('createdAt', expect.any(Date));
    expect(accountHolderFound).toHaveProperty('updatedAt', expect.any(Date));
  });

  it('should throw an exception if the account holder does not exist', async () => {
    //given
    const id = randomUUID();

    try {
      //when
      await getAccountHolderUseCase.execute({ id });
      expect.unreachable();
    } catch (error) {
      //then
      expect((error as Error).message).toBe('account holder not found');
    }
  });
});
