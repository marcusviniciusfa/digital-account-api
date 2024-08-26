import { CreateAccountHolderUseCase, DeleteAccountHolderUseCase } from '@src/application/use-cases/account-holder';
import { AccountHolderRepositoryPort } from '@src/ports';
import { randomUUID } from 'crypto';
import { AccountHolderFakeRepository } from 'tests/database/repositories';
import { DtoFactoryHelper } from 'tests/helpers';

describe('delete an account holder use case', () => {
  let accountHolderRepository: AccountHolderRepositoryPort;
  let createAccountHolderUseCase: CreateAccountHolderUseCase;
  let deleteAccountHolderUseCase: DeleteAccountHolderUseCase;

  beforeEach(() => {
    accountHolderRepository = new AccountHolderFakeRepository();
    createAccountHolderUseCase = new CreateAccountHolderUseCase(accountHolderRepository);
    deleteAccountHolderUseCase = new DeleteAccountHolderUseCase(accountHolderRepository);
  });

  it('should delete a account holder', async () => {
    //given
    const accountHolder = DtoFactoryHelper.makeCreateAccountHolderInput();
    const createdAccountHolder = await createAccountHolderUseCase.execute(accountHolder);

    //when
    await deleteAccountHolderUseCase.execute({ id: createdAccountHolder.id });
    const accountHolderExists = await accountHolderRepository.getById(createdAccountHolder.id);

    //then
    expect(accountHolderExists).toBe(null);
  });

  it('should throw an exception if you try to delete a account holder that does not exist', async () => {
    try {
      await deleteAccountHolderUseCase.execute({ id: randomUUID() });
      expect.unreachable();
    } catch (error) {
      expect((error as Error).message).toBe('account holder not found');
    }
  });
});
