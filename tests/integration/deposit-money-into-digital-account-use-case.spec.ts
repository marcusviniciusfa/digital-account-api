import { CreateAccountHolderUseCase } from '@src/application/use-cases/account-holder/create-account-holder-use-case';
import { BlockDigitalAccountUseCase } from '@src/application/use-cases/digital-account/block-digital-account-use-case';
import { CreateDigitalAccountUseCase } from '@src/application/use-cases/digital-account/create-digital-account-use-case';
import { DeactivateDigitalAccountUseCase } from '@src/application/use-cases/digital-account/deactivate-digital-account-case-case';
import { DepositMoneyIntoDigitalAccountUseCase } from '@src/application/use-cases/digital-account/deposit-money-into-digital-account-use-case';
import { GetDigitalAccountUseCase } from '@src/application/use-cases/digital-account/get-digital-account-use-case';
import { AccountHolderRepositoryPort } from '@src/ports/account-holder-repository-port';
import { DigitalAccountRepositoryPort } from '@src/ports/digital-account-repository-port';
import { StatementRepositoryPort } from '@src/ports/statement-repository-port';
import { randomUUID } from 'crypto';
import { StatementFakeRepository } from 'tests/adapters/repositories/statement-fake-repository ';
import { DelayHelper } from 'tests/helpers/delay-helper';
import { AccountHolderFakeRepository } from '../adapters/repositories/account-holder-fake-repository';
import { DigitalAccountFakeRepository } from '../adapters/repositories/digital-account-fake-repository';
import { DtoFactoryHelper } from '../helpers/dto-factory-helper';

describe('deposit money into an digital account use case', () => {
  let accountHolderRepository: AccountHolderRepositoryPort;
  let createAccountHolderUseCase: CreateAccountHolderUseCase;
  let digitalAccountRepository: DigitalAccountRepositoryPort;
  let createDigitalAccountUseCase: CreateDigitalAccountUseCase;
  let blockDigitalAccountUseCase: BlockDigitalAccountUseCase;
  let getDigitalAccountUseCase: GetDigitalAccountUseCase;
  let deactivateDigitalAccountUseCase: DeactivateDigitalAccountUseCase;
  let statementRepository: StatementRepositoryPort;
  let depositIntoDigitalAccountUseCase: DepositMoneyIntoDigitalAccountUseCase;

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
  });

  it('should deposit into an digital account', async () => {
    const accountHolder = DtoFactoryHelper.makeCreateAccountHolderInput();
    // given
    const createdAccountHolder = await createAccountHolderUseCase.execute(accountHolder);
    const createdDigitalAccount = await createDigitalAccountUseCase.execute({ cpf: createdAccountHolder.cpf });
    await DelayHelper.start(100);

    //when
    await depositIntoDigitalAccountUseCase.execute({ digitalAccountId: createdDigitalAccount.id, amount: 1000 });
    await depositIntoDigitalAccountUseCase.execute({ digitalAccountId: createdDigitalAccount.id, amount: 500 });
    const digitalAccount = await getDigitalAccountUseCase.execute({ digitalAccountId: createdDigitalAccount.id });

    //then
    expect(digitalAccount).toHaveProperty('balance', 1500);
    expect(digitalAccount.updatedAt).not.toBe(createdDigitalAccount.updatedAt);
  });

  it.each([0, -1])(
    'should not make a deposit into a digital account if the amount is less than or equal to zero',
    async amount => {
      const accountHolder = DtoFactoryHelper.makeCreateAccountHolderInput();
      // given
      const createdAccountHolder = await createAccountHolderUseCase.execute(accountHolder);
      const createdDigitalAccount = await createDigitalAccountUseCase.execute({ cpf: createdAccountHolder.cpf });

      //when
      try {
        await depositIntoDigitalAccountUseCase.execute({ digitalAccountId: createdDigitalAccount.id, amount });
        expect.unreachable();
      } catch (error) {
        //then
        expect((error as Error).message).toBe('invalid amount');
      }
    },
  );

  it('should throw an exception if you try to make a deposit into a blocked digital account', async () => {
    const accountHolder = DtoFactoryHelper.makeCreateAccountHolderInput();
    // given
    const createdAccountHolder = await createAccountHolderUseCase.execute(accountHolder);
    const createdDigitalAccount = await createDigitalAccountUseCase.execute({ cpf: createdAccountHolder.cpf });
    await blockDigitalAccountUseCase.execute({ digitalAccountId: createdDigitalAccount.id });

    try {
      //when
      await depositIntoDigitalAccountUseCase.execute({ digitalAccountId: createdDigitalAccount.id, amount: 1000 });
      expect.unreachable();
    } catch (error) {
      //then
      expect((error as Error).message).toBe('digital account is blocked');
    }
  });

  it('should throw an exception if you try to make a deposit into a digital account that does not exist', async () => {
    try {
      await depositIntoDigitalAccountUseCase.execute({ digitalAccountId: randomUUID(), amount: 1000 });
      expect.unreachable();
    } catch (error) {
      expect((error as Error).message).toBe('digital account not found');
    }
  });

  it('should throw an exception if you try to make a deposit into a digital account that does not exist', async () => {
    const accountHolder = DtoFactoryHelper.makeCreateAccountHolderInput();
    // given
    const createdAccountHolder = await createAccountHolderUseCase.execute(accountHolder);
    const createdDigitalAccount = await createDigitalAccountUseCase.execute({ cpf: createdAccountHolder.cpf });
    await deactivateDigitalAccountUseCase.execute({ digitalAccountId: createdDigitalAccount.id });

    try {
      // when
      await depositIntoDigitalAccountUseCase.execute({ digitalAccountId: randomUUID(), amount: 1000 });
      expect.unreachable();
    } catch (error) {
      // then
      expect((error as Error).message).toBe('digital account not found');
    }
  });
});
