import { CreateAccountHolderUseCase } from '@src/application/use-cases/account-holder';
import {
  BlockDigitalAccountUseCase,
  CreateDigitalAccountUseCase,
  GetDigitalAccountUseCase,
} from '@src/application/use-cases/digital-account';
import { AccountHolderRepositoryPort, DigitalAccountRepositoryPort } from '@src/ports';
import { randomUUID } from 'crypto';
import { AccountHolderFakeRepository, DigitalAccountFakeRepository } from 'tests/database/repositories';
import { DelayHelper, DtoFactoryHelper } from 'tests/helpers';

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
    try {
      await blockDigitalAccountUseCase.execute({ digitalAccountId: randomUUID() });
      expect.unreachable();
    } catch (error) {
      expect((error as Error).message).toBe('digital account not found');
    }
  });
});
