import { CreateAccountHolderUseCase } from '@src/application/use-cases/account-holder/create-account-holder-use-case';
import { GetAccountHolderUseCase } from '@src/application/use-cases/account-holder/get-account-holder-use-case';
import { AccountHolderRepositoryPort } from '@src/ports/account-holder-repository-port';
import { randomUUID } from 'crypto';
import { DtoFactoryHelper } from 'tests/helpers/dto-factory-helper';
import { AccountHolderFakeRepository } from '../adapters/repositories/account-holder-fake-repository';

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
