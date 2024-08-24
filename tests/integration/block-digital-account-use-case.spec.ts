import { CreateAccountHolderUseCase } from '@src/application/use-cases/account-holder/create-account-holder-use-case';
import { BlockDigitalAccountUseCase } from '@src/application/use-cases/digital-account/block-digital-account-use-case';
import { CreateDigitalAccountUseCase } from '@src/application/use-cases/digital-account/create-digital-account-use-case';
import { GetDigitalAccountUseCase } from '@src/application/use-cases/digital-account/get-digital-account-use-case';
import { AccountHolderRepositoryPort } from '@src/ports/account-holder-repository-port';
import { DigitalAccountRepositoryPort } from '@src/ports/digital-account-repository-port';
import { DelayHelper } from 'tests/helpers/delay-helper';
import { AccountHolderFakeRepository } from '../adapters/repositories/account-holder-fake-repository';
import { DigitalAccountFakeRepository } from '../adapters/repositories/digital-account-fake-repository';
import { DtoFactoryHelper } from '../helpers/dto-factory-helper';

describe('block an digital account use case', () => {
  let accountHolderRepository: AccountHolderRepositoryPort;
  let createAccountHolderUseCase: CreateAccountHolderUseCase;
  let digitalAccountRepository: DigitalAccountRepositoryPort;
  let createDigitalAccountUseCase: CreateDigitalAccountUseCase;
  let blockDigitalAccountUseCase: BlockDigitalAccountUseCase;
  let getDigitalAccountUseCase: GetDigitalAccountUseCase;

  beforeEach(() => {
    accountHolderRepository = new AccountHolderFakeRepository();
    createAccountHolderUseCase = new CreateAccountHolderUseCase(accountHolderRepository);
    digitalAccountRepository = new DigitalAccountFakeRepository();
    createDigitalAccountUseCase = new CreateDigitalAccountUseCase(accountHolderRepository, digitalAccountRepository);
    blockDigitalAccountUseCase = new BlockDigitalAccountUseCase(digitalAccountRepository);
    getDigitalAccountUseCase = new GetDigitalAccountUseCase(digitalAccountRepository);
  });

  it('should block an digital account', async () => {
    const accountHolder = DtoFactoryHelper.makeCreateAccountHolderInput();
    // given
    const createdAccountHolder = await createAccountHolderUseCase.execute(accountHolder);

    //when
    const createdDigitalAccount = await createDigitalAccountUseCase.execute({ cpf: createdAccountHolder.cpf });
    await DelayHelper.start(100);
    await blockDigitalAccountUseCase.execute({ digitalAccountId: createdDigitalAccount.id });
    const blockedDigitalAccount = await getDigitalAccountUseCase.execute({
      digitalAccountId: createdDigitalAccount.id,
    });

    //then
    expect(blockedDigitalAccount).toHaveProperty('isBlocked', true);
    expect(blockedDigitalAccount.updatedAt).not.toBe(createdDigitalAccount.updatedAt);
  });

  it('should not block a digital account that is already blocked', async () => {
    const accountHolder = DtoFactoryHelper.makeCreateAccountHolderInput();
    // given
    const createdAccountHolder = await createAccountHolderUseCase.execute(accountHolder);
    const createdDigitalAccount = await createDigitalAccountUseCase.execute({ cpf: createdAccountHolder.cpf });
    await blockDigitalAccountUseCase.execute({ digitalAccountId: createdDigitalAccount.id });

    try {
      //when
      await blockDigitalAccountUseCase.execute({ digitalAccountId: createdDigitalAccount.id });
      expect.unreachable();
    } catch (error) {
      //then
      expect((error as Error).message).toBe('digital account is already blocked');
    }
  });

  it('should throw an exception in case of trying to block a digital account that does not exist', async () => {
    //given
    const digitalAccount = DtoFactoryHelper.makeCreateAccountHolderInput();

    try {
      //when
      await blockDigitalAccountUseCase.execute({ digitalAccountId: digitalAccount.id });
      expect.unreachable();
    } catch (error) {
      //then
      expect((error as Error).message).toBe('digital account not found');
    }
  });
});
