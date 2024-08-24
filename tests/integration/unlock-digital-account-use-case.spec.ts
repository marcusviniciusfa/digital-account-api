import { CreateAccountHolderUseCase } from '@src/application/use-cases/account-holder/create-account-holder-use-case';
import { BlockDigitalAccountUseCase } from '@src/application/use-cases/digital-account/block-digital-account-use-case';
import { CreateDigitalAccountUseCase } from '@src/application/use-cases/digital-account/create-digital-account-use-case';
import { DeactivateDigitalAccountUseCase } from '@src/application/use-cases/digital-account/deactivate-digital-account-case-case';
import { GetDigitalAccountUseCase } from '@src/application/use-cases/digital-account/get-digital-account-use-case';
import { UnblockDigitalAccountUseCase } from '@src/application/use-cases/digital-account/unlock-digital-account-use-case';
import { AccountHolderRepositoryPort } from '@src/ports/account-holder-repository-port';
import { DigitalAccountRepositoryPort } from '@src/ports/digital-account-repository-port';
import { DelayHelper } from 'tests/helpers/delay-helper';
import { AccountHolderFakeRepository } from '../adapters/repositories/account-holder-fake-repository';
import { DigitalAccountFakeRepository } from '../adapters/repositories/digital-account-fake-repository';
import { DtoFactoryHelper } from '../helpers/dto-factory-helper';

describe('unlock an digital account use case', () => {
  let accountHolderRepository: AccountHolderRepositoryPort;
  let createAccountHolderUseCase: CreateAccountHolderUseCase;
  let digitalAccountRepository: DigitalAccountRepositoryPort;
  let createDigitalAccountUseCase: CreateDigitalAccountUseCase;
  let blockDigitalAccountUseCase: BlockDigitalAccountUseCase;
  let getDigitalAccountUseCase: GetDigitalAccountUseCase;
  let unlockDigitalAccountUseCase: UnblockDigitalAccountUseCase;
  let deactivateDigitalAccountUseCase: DeactivateDigitalAccountUseCase;

  beforeEach(() => {
    accountHolderRepository = new AccountHolderFakeRepository();
    createAccountHolderUseCase = new CreateAccountHolderUseCase(accountHolderRepository);
    digitalAccountRepository = new DigitalAccountFakeRepository();
    createDigitalAccountUseCase = new CreateDigitalAccountUseCase(accountHolderRepository, digitalAccountRepository);
    blockDigitalAccountUseCase = new BlockDigitalAccountUseCase(digitalAccountRepository);
    getDigitalAccountUseCase = new GetDigitalAccountUseCase(digitalAccountRepository);
    unlockDigitalAccountUseCase = new UnblockDigitalAccountUseCase(digitalAccountRepository);
    deactivateDigitalAccountUseCase = new DeactivateDigitalAccountUseCase(digitalAccountRepository);
  });

  it('should unlock an digital account', async () => {
    const accountHolder = DtoFactoryHelper.makeCreateAccountHolderInput();
    // given
    const createdAccountHolder = await createAccountHolderUseCase.execute(accountHolder);
    const createdDigitalAccount = await createDigitalAccountUseCase.execute({ cpf: createdAccountHolder.cpf });
    await blockDigitalAccountUseCase.execute({ digitalAccountId: createdDigitalAccount.id });
    const blockedDigitalAccount = await getDigitalAccountUseCase.execute({
      digitalAccountId: createdDigitalAccount.id,
    });
    await DelayHelper.start(100);

    //when
    await unlockDigitalAccountUseCase.execute({ digitalAccountId: createdDigitalAccount.id });
    const unlockedDigitalAccount = await getDigitalAccountUseCase.execute({
      digitalAccountId: createdDigitalAccount.id,
    });

    expect(blockedDigitalAccount).toHaveProperty('isBlocked', true);
    //then
    expect(unlockedDigitalAccount).toHaveProperty('isBlocked', false);
    expect(unlockedDigitalAccount.updatedAt).not.toBe(blockedDigitalAccount.updatedAt);
  });

  it('should not unlock a digital account that is already unlocked', async () => {
    const accountHolder = DtoFactoryHelper.makeCreateAccountHolderInput();
    // given
    const createdAccountHolder = await createAccountHolderUseCase.execute(accountHolder);
    const createdDigitalAccount = await createDigitalAccountUseCase.execute({ cpf: createdAccountHolder.cpf });

    try {
      //when
      await unlockDigitalAccountUseCase.execute({ digitalAccountId: createdDigitalAccount.id });
      expect.unreachable();
    } catch (error) {
      //then
      expect((error as Error).message).toBe('digital account is not blocked');
    }
  });

  it('should throw an exception in case of trying to block a digital account that does not exist', async () => {
    //given
    const digitalAccount = DtoFactoryHelper.makeCreateAccountHolderInput();

    try {
      //when
      await unlockDigitalAccountUseCase.execute({ digitalAccountId: digitalAccount.id });
      expect.unreachable();
    } catch (error) {
      //then
      expect((error as Error).message).toBe('digital account not found');
    }
  });

  it('should throw an exception if you try to unlock a deactivated digital account', async () => {
    const accountHolder = DtoFactoryHelper.makeCreateAccountHolderInput();
    // given
    const createdAccountHolder = await createAccountHolderUseCase.execute(accountHolder);
    const createdDigitalAccount = await createDigitalAccountUseCase.execute({ cpf: createdAccountHolder.cpf });
    await deactivateDigitalAccountUseCase.execute({ digitalAccountId: createdDigitalAccount.id });

    try {
      // when
      await unlockDigitalAccountUseCase.execute({ digitalAccountId: createdDigitalAccount.id });
      expect.unreachable();
    } catch (error) {
      // then
      expect((error as Error).message).toBe('digital account not found');
    }
  });
});
