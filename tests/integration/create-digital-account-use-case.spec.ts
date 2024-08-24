import { CreateAccountHolderUseCase } from '@src/application/use-cases/account-holder/create-account-holder-use-case';
import { CreateDigitalAccountUseCase } from '@src/application/use-cases/digital-account/create-digital-account-use-case';
import { AccountHolderRepositoryPort } from '@src/ports/account-holder-repository-port';
import { DigitalAccountRepositoryPort } from '@src/ports/digital-account-repository-port';
import { DelayHelper } from 'tests/helpers/delay-helper';
import { AccountHolderFakeRepository } from '../adapters/repositories/account-holder-fake-repository';
import { DigitalAccountFakeRepository } from '../adapters/repositories/digital-account-fake-repository';
import { DtoFactoryHelper } from '../helpers/dto-factory-helper';

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
    expect(createdDigitalAccount).toHaveProperty('accountNumber', '000000001');
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

  it('should create a digital account with a unique sequential account number', async () => {
    // given
    const createdAccountHolderA = await createAccountHolderUseCase.execute(DtoFactoryHelper.makeCreateAccountHolderInput());
    const createdAccountHolderB = await createAccountHolderUseCase.execute(DtoFactoryHelper.makeCreateAccountHolderInput());
    const createdAccountHolderC = await createAccountHolderUseCase.execute(DtoFactoryHelper.makeCreateAccountHolderInput());
    const createdAccountHolderD = await createAccountHolderUseCase.execute(DtoFactoryHelper.makeCreateAccountHolderInput());
    const createdAccountHolderE = await createAccountHolderUseCase.execute(DtoFactoryHelper.makeCreateAccountHolderInput());

    const createdDigitalAccountA = await createDigitalAccountUseCase.execute({ cpf: createdAccountHolderA.cpf });
    await DelayHelper.start(10);
    const createdDigitalAccountB = await createDigitalAccountUseCase.execute({ cpf: createdAccountHolderB.cpf });
    await DelayHelper.start(10);
    const createdDigitalAccountC = await createDigitalAccountUseCase.execute({ cpf: createdAccountHolderC.cpf });
    await DelayHelper.start(10);
    const createdDigitalAccountD = await createDigitalAccountUseCase.execute({ cpf: createdAccountHolderD.cpf });
    await DelayHelper.start(10);
    const createdDigitalAccountE = await createDigitalAccountUseCase.execute({ cpf: createdAccountHolderE.cpf });

    //when
    const digitalAccountA = await digitalAccountRepository.getById(createdDigitalAccountA.id);
    const digitalAccountB = await digitalAccountRepository.getById(createdDigitalAccountB.id);
    const digitalAccountC = await digitalAccountRepository.getById(createdDigitalAccountC.id);
    const digitalAccountD = await digitalAccountRepository.getById(createdDigitalAccountD.id);
    const digitalAccountE = await digitalAccountRepository.getById(createdDigitalAccountE.id);

    //then
    expect(digitalAccountA?.accountNumber).toBe('000000001');
    expect(digitalAccountB?.accountNumber).toBe('000000002');
    expect(digitalAccountC?.accountNumber).toBe('000000003');
    expect(digitalAccountD?.accountNumber).toBe('000000004');
    expect(digitalAccountE?.accountNumber).toBe('000000005');
  });
});
