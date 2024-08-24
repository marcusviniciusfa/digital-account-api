import { CreateAccountHolderUseCase } from '@src/application/use-cases/account-holder/create-account-holder-use-case';
import { UpdateAccountHolderUseCase } from '@src/application/use-cases/account-holder/update-account-holder-use-case';
import { AccountHolderRepositoryPort } from '@src/ports/account-holder-repository-port';
import { randomUUID } from 'crypto';
import { DelayHelper } from 'tests/helpers/delay-helper';
import { AccountHolderFakeRepository } from '../adapters/repositories/account-holder-fake-repository';
import { DtoFactoryHelper } from '../helpers/dto-factory-helper';

describe('update an account holder use case', () => {
  let accountHolderRepository: AccountHolderRepositoryPort;
  let createAccountHolderUseCase: CreateAccountHolderUseCase;
  let updateAccountHolderUseCase: UpdateAccountHolderUseCase;

  beforeEach(() => {
    accountHolderRepository = new AccountHolderFakeRepository();
    createAccountHolderUseCase = new CreateAccountHolderUseCase(accountHolderRepository);
    updateAccountHolderUseCase = new UpdateAccountHolderUseCase(accountHolderRepository);
  });

  it('should update an account holder', async () => {
    //given
    const accountHolder = DtoFactoryHelper.makeCreateAccountHolderInput();
    const createdAccountHolder = await createAccountHolderUseCase.execute(accountHolder);
    await DelayHelper.start(100);

    //when
    const holderToUpdate = DtoFactoryHelper.makeUpdateAccountHolderInput({
      id: createdAccountHolder.id,
      name: 'John Doe',
    });
    const updatedAccountHolder = await updateAccountHolderUseCase.execute(holderToUpdate);

    //then
    expect(updatedAccountHolder).toHaveProperty('name', holderToUpdate.name);
    expect(updatedAccountHolder).toHaveProperty('cpf', createdAccountHolder.cpf);
    expect(updatedAccountHolder).toHaveProperty('id', createdAccountHolder.id);
    expect(updatedAccountHolder).toHaveProperty('createdAt', createdAccountHolder.createdAt);
    expect(updatedAccountHolder).toHaveProperty('updatedAt', expect.any(Date));
    expect(updatedAccountHolder.updatedAt).not.toBe(createdAccountHolder.updatedAt);
  });

  it('should throw an exception if the account holder does not exist', async () => {
    //given
    const accountHolder = DtoFactoryHelper.makeUpdateAccountHolderInput({ id: randomUUID() });

    try {
      //when
      await updateAccountHolderUseCase.execute(accountHolder);
      expect.unreachable();
    } catch (error) {
      //then
      expect((error as Error).message).toBe('account holder not found');
    }
  });
});
