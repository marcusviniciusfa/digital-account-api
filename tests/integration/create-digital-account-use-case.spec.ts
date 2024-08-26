import { CreateAccountHolderUseCase } from '@src/application/use-cases/account-holder/create-account-holder-use-case';
import { CreateDigitalAccountUseCase } from '@src/application/use-cases/digital-account/create-digital-account-use-case';
import { DateHelper } from '@src/helpers/date-helper';
import { AccountHolder, AccountHolderRepositoryPort } from '@src/ports/account-holder-repository-port';
import { DigitalAccount, DigitalAccountRepositoryPort } from '@src/ports/digital-account-repository-port';
import { randomInt, randomUUID } from 'crypto';
import { AccountHolderFakeRepository } from '../adapters/repositories/account-holder-fake-repository';
import { DigitalAccountFakeRepository } from '../adapters/repositories/digital-account-fake-repository';
import { DtoFactoryHelper } from '../helpers/dto-factory-helper';

// todo: ajustar os testes para o novo cenário de criação de conta digital direto no caso de uso
describe('create an digital account use case', () => {
  let accountHolderRepository: AccountHolderRepositoryPort;
  let createAccountHolderUseCase: CreateAccountHolderUseCase;
  let digitalAccountRepository: DigitalAccountRepositoryPort;
  let createDigitalAccountUseCase: CreateDigitalAccountUseCase;

  beforeEach(() => {
    accountHolderRepository = new AccountHolderFakeRepository();
    createAccountHolderUseCase = new CreateAccountHolderUseCase(accountHolderRepository);
    digitalAccountRepository = new DigitalAccountFakeRepository();
    createDigitalAccountUseCase = new CreateDigitalAccountUseCase(accountHolderRepository, digitalAccountRepository);
  });

  it('should create an digital account with holder cpf', async () => {
    const accountHolder = DtoFactoryHelper.makeCreateAccountHolderInput();
    // given
    const createdAccountHolder = await createAccountHolderUseCase.execute(accountHolder);

    //when
    const createdDigitalAccount = await createDigitalAccountUseCase.execute({ cpf: createdAccountHolder.cpf });

    //then
    expect(createdDigitalAccount).toHaveProperty('holderId', createdAccountHolder.id);
    expect(createdDigitalAccount).toHaveProperty('accountNumber', expect.any(String));
    expect(createdDigitalAccount).toHaveProperty('agency', '0001');
    expect(createdDigitalAccount).toHaveProperty('balance', expect.any(Number));
    expect(createdDigitalAccount).toHaveProperty('isBlocked', false);
    expect(createdDigitalAccount).toHaveProperty('createdAt', expect.any(Date));
    expect(createdDigitalAccount).toHaveProperty('updatedAt', expect.any(Date));
  });

  it('should throw an exception if you can not find the account holder to create it', async () => {
    // given
    const accountHolder = DtoFactoryHelper.makeCreateAccountHolderInput();

    //when
    try {
      await createDigitalAccountUseCase.execute({ cpf: accountHolder.cpf });
      expect.unreachable();
    } catch (error) {
      //then
      expect((error as Error).message).toBe('account holder not found');
    }
  });

  it('should create a digital account with a unique account number', async () => {
    // given
    const createdAccountHolderA = await createAccountHolderUseCase.execute(
      DtoFactoryHelper.makeCreateAccountHolderInput(),
    );
    const createdAccountHolderB = await createAccountHolderUseCase.execute(
      DtoFactoryHelper.makeCreateAccountHolderInput(),
    );

    CreateDigitalAccountUseCase.prototype.makeDigitalAccount = vi
      .fn()
      .mockImplementation(
        (accountHolder: AccountHolder): DigitalAccount => ({
          id: randomUUID(),
          holderId: accountHolder.id,
          agency: (1).toString().padStart(4, '0'),
          accountNumber: randomInt(1, 999999999).toString().padStart(9, '0'),
          balance: 0,
          isBlocked: false,
          createdAt: DateHelper.localToUTC(),
          updatedAt: DateHelper.localToUTC(),
        }),
      )
      .mockImplementationOnce(
        (accountHolder: AccountHolder): DigitalAccount => ({
          id: randomUUID(),
          holderId: accountHolder.id,
          agency: '0001',
          accountNumber: '000000001',
          balance: 0,
          isBlocked: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      )
      .mockImplementationOnce(
        (accountHolder: AccountHolder): DigitalAccount => ({
          id: randomUUID(),
          holderId: accountHolder.id,
          agency: '0001',
          accountNumber: '000000001',
          balance: 0,
          isBlocked: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      );

    //when
    const createdDigitalAccountA = await createDigitalAccountUseCase.execute({ cpf: createdAccountHolderA.cpf });
    const createdDigitalAccountB = await createDigitalAccountUseCase.execute({ cpf: createdAccountHolderB.cpf });

    vi.restoreAllMocks();

    const digitalAccountA = await digitalAccountRepository.getById(createdDigitalAccountA.id);
    const digitalAccountB = await digitalAccountRepository.getById(createdDigitalAccountB.id);

    //then
    expect(digitalAccountA).toHaveProperty('accountNumber', '000000001');
    expect(digitalAccountB).toHaveProperty('accountNumber', expect.any(String));
  });

  it('should throw an exception if the cause of the error is different from "account_number_already_exists"', async () => {
    // given
    const createdAccountHolderA = await createAccountHolderUseCase.execute(
      DtoFactoryHelper.makeCreateAccountHolderInput(),
    );

    digitalAccountRepository.create.prototype = vi.fn().mockRejectedValueOnce(new Error());

    vi.restoreAllMocks();

    try {
      //when
      await createDigitalAccountUseCase.execute({ cpf: createdAccountHolderA.cpf });
      expect.unreachable();
    } catch (error) {
      //then
      expect((error as Error).cause).toBeUndefined();
    }
  });
});
