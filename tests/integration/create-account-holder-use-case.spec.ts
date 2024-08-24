import { CreateAccountHolderUseCase } from '@src/application/use-cases/account-holder/create-account-holder-use-case';
import { AccountHolderRepositoryPort } from '@src/ports/account-holder-repository-port';
import { AccountHolderFakeRepository } from '../adapters/repositories/account-holder-fake-repository';
import { DtoFactoryHelper } from '../helpers/dto-factory-helper';

describe('create an account holder use case', () => {
  let accountHolderRepository: AccountHolderRepositoryPort;
  let createAccountHolderUseCase: CreateAccountHolderUseCase;

  beforeEach(() => {
    accountHolderRepository = new AccountHolderFakeRepository();
    createAccountHolderUseCase = new CreateAccountHolderUseCase(accountHolderRepository);
  });

  it('should create an account holder with name, cpf', async () => {
    //given
    const accountHolder = DtoFactoryHelper.makeCreateAccountHolderInput();

    //when
    const createdAccountHolder = await createAccountHolderUseCase.execute(accountHolder);

    //then
    expect(createdAccountHolder).toHaveProperty('name', accountHolder.name);
    expect(createdAccountHolder).toHaveProperty('cpf', accountHolder.cpf);
    expect(createdAccountHolder).toHaveProperty('id', expect.any(String));
    expect(createdAccountHolder).toHaveProperty('createdAt', expect.any(Date));
    expect(createdAccountHolder).toHaveProperty('updatedAt', expect.any(Date));
  });

  it('should be an exception in case of trying to create an account holder with an invalid cpf', async () => {
    //given
    const accountHolder = DtoFactoryHelper.makeCreateAccountHolderInput({ cpf: '123.456.789-00' });

    try {
      //when
      await createAccountHolderUseCase.execute(accountHolder);
      expect.unreachable();
    } catch (error) {
      //then
      expect((error as Error).message).toBe('invalid cpf');
    }
  });

  it('should be an exception in case of trying to create an account holder that already exists', async () => {
    //given
    const accountHolder = DtoFactoryHelper.makeCreateAccountHolderInput();
    await createAccountHolderUseCase.execute(accountHolder);

    try {
      //when
      await createAccountHolderUseCase.execute(accountHolder);
      expect.unreachable();
    } catch (error) {
      //then
      expect((error as Error).message).toBe('account holder already exists');
    }
  });
});
