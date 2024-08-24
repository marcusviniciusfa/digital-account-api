import { CreateAccountHolderUseCase } from '@src/application/use-cases/account-holder/create-account-holder-use-case';
import { BlockDigitalAccountUseCase } from '@src/application/use-cases/digital-account/block-digital-account-use-case';
import { CreateDigitalAccountUseCase } from '@src/application/use-cases/digital-account/create-digital-account-use-case';
import { DeactivateDigitalAccountUseCase } from '@src/application/use-cases/digital-account/deactivate-digital-account-case-case';
import { DepositMoneyIntoDigitalAccountUseCase } from '@src/application/use-cases/digital-account/deposit-money-into-digital-account-use-case';
import { GetDigitalAccountUseCase } from '@src/application/use-cases/digital-account/get-digital-account-use-case';
import { WithdrawMoneyFromDigitalAccountUseCase } from '@src/application/use-cases/digital-account/withdraw-money-from-digital-account-use-case';
import { AccountHolderRepositoryPort } from '@src/ports/account-holder-repository-port';
import { DigitalAccountRepositoryPort } from '@src/ports/digital-account-repository-port';
import { StatementRepositoryPort } from '@src/ports/statement-repository-port';
import { randomUUID } from 'crypto';
import { StatementFakeRepository } from 'tests/adapters/repositories/statement-fake-repository ';
import { DelayHelper } from 'tests/helpers/delay-helper';
import { AccountHolderFakeRepository } from '../adapters/repositories/account-holder-fake-repository';
import { DigitalAccountFakeRepository } from '../adapters/repositories/digital-account-fake-repository';
import { DtoFactoryHelper } from '../helpers/dto-factory-helper';

describe('withdraw money from digital account use case', () => {
  let accountHolderRepository: AccountHolderRepositoryPort;
  let createAccountHolderUseCase: CreateAccountHolderUseCase;
  let digitalAccountRepository: DigitalAccountRepositoryPort;
  let createDigitalAccountUseCase: CreateDigitalAccountUseCase;
  let blockDigitalAccountUseCase: BlockDigitalAccountUseCase;
  let getDigitalAccountUseCase: GetDigitalAccountUseCase;
  let deactivateDigitalAccountUseCase: DeactivateDigitalAccountUseCase;
  let depositIntoDigitalAccountUseCase: DepositMoneyIntoDigitalAccountUseCase;
  let statementRepository: StatementRepositoryPort;
  let withdrawMoneyFromDigitalAccountUseCase: WithdrawMoneyFromDigitalAccountUseCase;

  beforeEach(() => {
    accountHolderRepository = new AccountHolderFakeRepository();
    createAccountHolderUseCase = new CreateAccountHolderUseCase(accountHolderRepository);
    digitalAccountRepository = new DigitalAccountFakeRepository();
    createDigitalAccountUseCase = new CreateDigitalAccountUseCase(accountHolderRepository, digitalAccountRepository);
    blockDigitalAccountUseCase = new BlockDigitalAccountUseCase(digitalAccountRepository);
    getDigitalAccountUseCase = new GetDigitalAccountUseCase(digitalAccountRepository);
    deactivateDigitalAccountUseCase = new DeactivateDigitalAccountUseCase(digitalAccountRepository);
    statementRepository = new StatementFakeRepository();
    depositIntoDigitalAccountUseCase = new DepositMoneyIntoDigitalAccountUseCase(
      digitalAccountRepository,
      statementRepository,
    );
    withdrawMoneyFromDigitalAccountUseCase = new WithdrawMoneyFromDigitalAccountUseCase(
      digitalAccountRepository,
      statementRepository,
    );
  });

  it('should withdraw money from an digital account', async () => {
    const accountHolder = DtoFactoryHelper.makeCreateAccountHolderInput();
    // given
    const createdAccountHolder = await createAccountHolderUseCase.execute(accountHolder);
    const createdDigitalAccount = await createDigitalAccountUseCase.execute({ cpf: createdAccountHolder.cpf });
    await DelayHelper.start(100);

    //when
    await depositIntoDigitalAccountUseCase.execute({ digitalAccountId: createdDigitalAccount.id, amount: 1000 });
    await withdrawMoneyFromDigitalAccountUseCase.execute({ digitalAccountId: createdDigitalAccount.id, amount: 250 });
    const digitalAccount = await getDigitalAccountUseCase.execute({ digitalAccountId: createdDigitalAccount.id });

    //then
    expect(digitalAccount).toHaveProperty('balance', 750);
    expect(digitalAccount.updatedAt).not.toBe(createdDigitalAccount.updatedAt);
  });

  it.each([0, -1])(
    'should not withdraw money from an digital account if the amount is less than or equal to zero',
    async amount => {
      const accountHolder = DtoFactoryHelper.makeCreateAccountHolderInput();
      // given
      const createdAccountHolder = await createAccountHolderUseCase.execute(accountHolder);
      const createdDigitalAccount = await createDigitalAccountUseCase.execute({ cpf: createdAccountHolder.cpf });

      //when
      try {
        await withdrawMoneyFromDigitalAccountUseCase.execute({ digitalAccountId: createdDigitalAccount.id, amount });
        expect.unreachable();
      } catch (error) {
        //then
        expect((error as Error).message).toBe('invalid amount');
      }
    },
  );

  it('should not allow withdrawal to exceed the daily limit of 2000 from the first time', async () => {
    const accountHolder = DtoFactoryHelper.makeCreateAccountHolderInput();
    // given
    const createdAccountHolder = await createAccountHolderUseCase.execute(accountHolder);
    const createdDigitalAccount = await createDigitalAccountUseCase.execute({ cpf: createdAccountHolder.cpf });
    await depositIntoDigitalAccountUseCase.execute({ digitalAccountId: createdDigitalAccount.id, amount: 5000 });

    //when
    try {
      await withdrawMoneyFromDigitalAccountUseCase.execute({
        digitalAccountId: createdDigitalAccount.id,
        amount: 2001,
      });
      expect.unreachable();
    } catch (error) {
      //then
      expect((error as Error).message).toBe('amount exceeds daily limit');
    }
  });

  it('should not allow the withdrawal to exceed the daily limit of 2000 on the nth time', async () => {
    const accountHolder = DtoFactoryHelper.makeCreateAccountHolderInput();
    // given
    const createdAccountHolder = await createAccountHolderUseCase.execute(accountHolder);
    const createdDigitalAccount = await createDigitalAccountUseCase.execute({ cpf: createdAccountHolder.cpf });
    await depositIntoDigitalAccountUseCase.execute({ digitalAccountId: createdDigitalAccount.id, amount: 5000 });
    await withdrawMoneyFromDigitalAccountUseCase.execute({ digitalAccountId: createdDigitalAccount.id, amount: 2000 });

    //when
    try {
      await withdrawMoneyFromDigitalAccountUseCase.execute({ digitalAccountId: createdDigitalAccount.id, amount: 1 });
      expect.unreachable();
    } catch (error) {
      //then
      expect((error as Error).message).toBe('amount exceeds daily limit');
    }
  });

  it('should throw an exception if try withdraw money from an digital account that does not exist', async () => {
    try {
      await withdrawMoneyFromDigitalAccountUseCase.execute({ digitalAccountId: randomUUID(), amount: 1000 });
      expect.unreachable();
    } catch (error) {
      expect((error as Error).message).toBe('digital account not found');
    }
  });

  it('should throw an exception if try withdraw money from an digital account that does not exist', async () => {
    const accountHolder = DtoFactoryHelper.makeCreateAccountHolderInput();
    // given
    const createdAccountHolder = await createAccountHolderUseCase.execute(accountHolder);
    const createdDigitalAccount = await createDigitalAccountUseCase.execute({ cpf: createdAccountHolder.cpf });
    await deactivateDigitalAccountUseCase.execute({ digitalAccountId: createdDigitalAccount.id });

    try {
      // when
      await withdrawMoneyFromDigitalAccountUseCase.execute({ digitalAccountId: randomUUID(), amount: 1000 });
      expect.unreachable();
    } catch (error) {
      // then
      expect((error as Error).message).toBe('digital account not found');
    }
  });

  it('should throw an exception if try withdraw money from an blocked digital account', async () => {
    const accountHolder = DtoFactoryHelper.makeCreateAccountHolderInput();
    // given
    const createdAccountHolder = await createAccountHolderUseCase.execute(accountHolder);
    const createdDigitalAccount = await createDigitalAccountUseCase.execute({ cpf: createdAccountHolder.cpf });
    await blockDigitalAccountUseCase.execute({ digitalAccountId: createdDigitalAccount.id });

    try {
      // when
      await withdrawMoneyFromDigitalAccountUseCase.execute({
        digitalAccountId: createdDigitalAccount.id,
        amount: 1000,
      });
      expect.unreachable();
    } catch (error) {
      // then
      expect((error as Error).message).toBe('digital account is blocked');
    }
  });

  it('should throw an exception if try to remove money from a digital account that has insufficient balance', async () => {
    const accountHolder = DtoFactoryHelper.makeCreateAccountHolderInput();
    // given
    const createdAccountHolder = await createAccountHolderUseCase.execute(accountHolder);
    const createdDigitalAccount = await createDigitalAccountUseCase.execute({ cpf: createdAccountHolder.cpf });
    await depositIntoDigitalAccountUseCase.execute({ digitalAccountId: createdDigitalAccount.id, amount: 500 });

    try {
      // when
      await withdrawMoneyFromDigitalAccountUseCase.execute({
        digitalAccountId: createdDigitalAccount.id,
        amount: 1000,
      });
      expect.unreachable();
    } catch (error) {
      // then
      expect((error as Error).message).toBe('insufficient balance');
    }
  });
});
