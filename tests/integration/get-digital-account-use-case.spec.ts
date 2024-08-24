import { CreateAccountHolderUseCase } from '@src/application/use-cases/account-holder/create-account-holder-use-case';
import { CreateDigitalAccountUseCase } from '@src/application/use-cases/digital-account/create-digital-account-use-case';
import { DeactivateDigitalAccountUseCase } from '@src/application/use-cases/digital-account/deactivate-digital-account-case-case';
import { GetDigitalAccountUseCase } from '@src/application/use-cases/digital-account/get-digital-account-use-case';
import { AccountHolderRepositoryPort } from '@src/ports/account-holder-repository-port';
import { DigitalAccountRepositoryPort } from '@src/ports/digital-account-repository-port';
import { randomUUID } from 'crypto';
import { AccountHolderFakeRepository } from '../adapters/repositories/account-holder-fake-repository';
import { DigitalAccountFakeRepository } from '../adapters/repositories/digital-account-fake-repository';
import { DtoFactoryHelper } from '../helpers/dto-factory-helper';

describe('get an digital account use case', () => {
  let accountHolderRepository: AccountHolderRepositoryPort;
  let createAccountHolderUseCase: CreateAccountHolderUseCase;
  let digitalAccountRepository: DigitalAccountRepositoryPort;
  let createDigitalAccountUseCase: CreateDigitalAccountUseCase;
  let getDigitalAccountUseCase: GetDigitalAccountUseCase;
  let deactivateDigitalAccountUseCase: DeactivateDigitalAccountUseCase;

  beforeEach(() => {
    accountHolderRepository = new AccountHolderFakeRepository();
    createAccountHolderUseCase = new CreateAccountHolderUseCase(accountHolderRepository);
    digitalAccountRepository = new DigitalAccountFakeRepository();
    createDigitalAccountUseCase = new CreateDigitalAccountUseCase(accountHolderRepository, digitalAccountRepository);
    getDigitalAccountUseCase = new GetDigitalAccountUseCase(digitalAccountRepository);
    deactivateDigitalAccountUseCase = new DeactivateDigitalAccountUseCase(digitalAccountRepository);
  });

  it('should get an digital account', async () => {
    const accountHolder = DtoFactoryHelper.makeCreateAccountHolderInput();
    // given
    const createdAccountHolder = await createAccountHolderUseCase.execute(accountHolder);
    const createdDigitalAccount = await createDigitalAccountUseCase.execute({ cpf: createdAccountHolder.cpf });

    //when
    const digitalAccount = await getDigitalAccountUseCase.execute({ digitalAccountId: createdDigitalAccount.id });

    //then
    expect(digitalAccount).toHaveProperty('holderId', createdAccountHolder.id);
    expect(digitalAccount).toHaveProperty('accountNumber', expect.any(String));
    expect(digitalAccount).toHaveProperty('agency', expect.any(String));
    expect(digitalAccount).toHaveProperty('balance', expect.any(Number));
    expect(digitalAccount).toHaveProperty('isBlocked', false);
    expect(digitalAccount).toHaveProperty('createdAt', expect.any(Date));
    expect(digitalAccount).toHaveProperty('updatedAt', expect.any(Date));
  });

  it('should throw an exception if the digital account does not exist', async () => {
    try {
      await getDigitalAccountUseCase.execute({ digitalAccountId: randomUUID() });
      expect.unreachable();
    } catch (error) {
      expect((error as Error).message).toBe('digital account not found');
    }
  });

  it('should throw an exception if you try to get a deactivated digital account', async () => {
    const accountHolder = DtoFactoryHelper.makeCreateAccountHolderInput();
    // given
    const createdAccountHolder = await createAccountHolderUseCase.execute(accountHolder);
    const createdDigitalAccount = await createDigitalAccountUseCase.execute({ cpf: createdAccountHolder.cpf });
    await deactivateDigitalAccountUseCase.execute({ digitalAccountId: createdDigitalAccount.id });

    try {
      // when
      await getDigitalAccountUseCase.execute({ digitalAccountId: createdDigitalAccount.id });
      expect.unreachable();
    } catch (error) {
      // then
      expect((error as Error).message).toBe('digital account not found');
    }
  });
});
