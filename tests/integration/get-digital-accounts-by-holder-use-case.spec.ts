import { CreateAccountHolderUseCase } from '@src/application/use-cases/account-holder/create-account-holder-use-case';
import { CreateDigitalAccountUseCase } from '@src/application/use-cases/digital-account/create-digital-account-use-case';
import { DeactivateDigitalAccountUseCase } from '@src/application/use-cases/digital-account/deactivate-digital-account-case-case';
import { GetDigitalAccountsByHolderUseCase } from '@src/application/use-cases/digital-account/get-digital-accounts-by-holder-use-case';
import { AccountHolderRepositoryPort } from '@src/ports/account-holder-repository-port';
import { DigitalAccountRepositoryPort } from '@src/ports/digital-account-repository-port';
import { randomUUID } from 'crypto';
import { DelayHelper } from 'tests/helpers/delay-helper';
import { AccountHolderFakeRepository } from '../adapters/repositories/account-holder-fake-repository';
import { DigitalAccountFakeRepository } from '../adapters/repositories/digital-account-fake-repository';
import { DtoFactoryHelper } from '../helpers/dto-factory-helper';

describe('get all digital accounts by holder use case', () => {
  let accountHolderRepository: AccountHolderRepositoryPort;
  let createAccountHolderUseCase: CreateAccountHolderUseCase;
  let digitalAccountRepository: DigitalAccountRepositoryPort;
  let createDigitalAccountUseCase: CreateDigitalAccountUseCase;
  let getDigitalAccountsByHolderUseCase: GetDigitalAccountsByHolderUseCase;
  let deactivateDigitalAccountUseCase: DeactivateDigitalAccountUseCase;

  beforeEach(() => {
    accountHolderRepository = new AccountHolderFakeRepository();
    createAccountHolderUseCase = new CreateAccountHolderUseCase(accountHolderRepository);
    digitalAccountRepository = new DigitalAccountFakeRepository();
    createDigitalAccountUseCase = new CreateDigitalAccountUseCase(accountHolderRepository, digitalAccountRepository);
    getDigitalAccountsByHolderUseCase = new GetDigitalAccountsByHolderUseCase(digitalAccountRepository);
    deactivateDigitalAccountUseCase = new DeactivateDigitalAccountUseCase(digitalAccountRepository);
  });

  it('should get all digital accounts by holder', async () => {
    const accountHolderA = DtoFactoryHelper.makeCreateAccountHolderInput();
    const accountHolderB = DtoFactoryHelper.makeCreateAccountHolderInput();

    // given
    const createdAccountHolderA = await createAccountHolderUseCase.execute(accountHolderB);
    await createDigitalAccountUseCase.execute({ cpf: createdAccountHolderA.cpf });

    const createdAccountHolderB = await createAccountHolderUseCase.execute(accountHolderA);
    await createDigitalAccountUseCase.execute({ cpf: createdAccountHolderB.cpf });
    await DelayHelper.start(10);
    await createDigitalAccountUseCase.execute({ cpf: createdAccountHolderB.cpf });
    await DelayHelper.start(10);
    await createDigitalAccountUseCase.execute({ cpf: createdAccountHolderB.cpf });

    //when
    const digitalAccountsA = await getDigitalAccountsByHolderUseCase.execute({ holderId: createdAccountHolderA.id });
    const digitalAccountsB = await getDigitalAccountsByHolderUseCase.execute({ holderId: createdAccountHolderB.id });

    //then
    expect(digitalAccountsA).toHaveLength(1);
    expect(digitalAccountsB).toHaveLength(3);
    expect(digitalAccountsA[0]).toHaveProperty('accountNumber', expect.any(String));
    expect(digitalAccountsA[0]).toHaveProperty('agency', expect.any(String));
    expect(digitalAccountsA[0]).toHaveProperty('balance', expect.any(Number));
    expect(digitalAccountsA[0]).toHaveProperty('isBlocked', false);
    expect(digitalAccountsA[0]).toHaveProperty('createdAt', expect.any(Date));
    expect(digitalAccountsA[0]).toHaveProperty('updatedAt', expect.any(Date));
  });

  it('should return an empty array if the holder does not have digital accounts', async () => {
    const digitalAccounts = await getDigitalAccountsByHolderUseCase.execute({ holderId: randomUUID() });
    expect(digitalAccounts).toHaveLength(0);
  });

  it('should not return deactivated digital accounts', async () => {
    const accountHolder = DtoFactoryHelper.makeCreateAccountHolderInput();

    const createdAccountHolder = await createAccountHolderUseCase.execute(accountHolder);
    const digitalAccountToDeactivate = await createDigitalAccountUseCase.execute({ cpf: createdAccountHolder.cpf });
    await DelayHelper.start(10);
    await createDigitalAccountUseCase.execute({ cpf: createdAccountHolder.cpf });
    await DelayHelper.start(10);
    await createDigitalAccountUseCase.execute({ cpf: createdAccountHolder.cpf });

    const digitalAccountsBefore = await getDigitalAccountsByHolderUseCase.execute({
      holderId: createdAccountHolder.id,
    });
    expect(digitalAccountsBefore).toHaveLength(3);

    //when
    await deactivateDigitalAccountUseCase.execute({ digitalAccountId: digitalAccountToDeactivate.id });
    const digitalAccountsAfter = await getDigitalAccountsByHolderUseCase.execute({ holderId: createdAccountHolder.id });

    //then
    expect(digitalAccountsAfter).toHaveLength(2);
  });
});