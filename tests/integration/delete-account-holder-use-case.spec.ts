import { CreateAccountHolderUseCase } from '@src/application/use-cases/account-holder/create-account-holder-use-case';
import { DeleteAccountHolderUseCase } from '@src/application/use-cases/account-holder/delete-account-holder-use-case';
import { AccountHolderRepositoryPort } from '@src/ports/account-holder-repository-port';
import { DtoFactoryHelper } from 'tests/helpers/dto-factory-helper';
import { AccountHolderFakeRepository } from '../adapters/repositories/account-holder-fake-repository';

describe('delete an account holder use case', () => {
  let accountHolderRepository: AccountHolderRepositoryPort;
  let createAccountHolderUseCase: CreateAccountHolderUseCase;
  let deleteAccountHolderUseCase: DeleteAccountHolderUseCase;

  beforeEach(() => {
    accountHolderRepository = new AccountHolderFakeRepository();
    createAccountHolderUseCase = new CreateAccountHolderUseCase(accountHolderRepository);
    deleteAccountHolderUseCase = new DeleteAccountHolderUseCase(accountHolderRepository);
  });

  it('should delete a holder', async () => {
    //given
    const accountHolder = DtoFactoryHelper.makeCreateAccountHolderInput();
    const createdAccountHolder = await createAccountHolderUseCase.execute(accountHolder);

    //when
    await deleteAccountHolderUseCase.execute({ id: createdAccountHolder.id });
    const accountHolderExists = await accountHolderRepository.getById(createdAccountHolder.id);

    //then
    expect(accountHolderExists).toBe(null);
  });
});
