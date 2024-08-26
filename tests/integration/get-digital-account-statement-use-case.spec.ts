import { CreateAccountHolderUseCase } from '@src/application/use-cases/account-holder';
import {
  CreateDigitalAccountUseCase,
  DeactivateDigitalAccountUseCase,
  DepositMoneyIntoDigitalAccountUseCase,
  GetDigitalAccountStatementUseCase,
  GetDigitalAccountUseCase,
  WithdrawMoneyFromDigitalAccountUseCase,
} from '@src/application/use-cases/digital-account';
import { DateHelper } from '@src/helpers/date-helper';
import {
  AccountHolderRepositoryPort,
  AccountOperationType,
  DigitalAccountRepositoryPort,
  StatementRepositoryPort,
} from '@src/ports';
import { randomUUID } from 'crypto';
import {
  AccountHolderFakeRepository,
  DigitalAccountFakeRepository,
  StatementFakeRepository,
} from 'tests/database/repositories';
import { DelayHelper, DtoFactoryHelper } from 'tests/helpers';

describe('get an digital account statement use case', () => {
  let accountHolderRepository: AccountHolderRepositoryPort;
  let createAccountHolderUseCase: CreateAccountHolderUseCase;
  let digitalAccountRepository: DigitalAccountRepositoryPort;
  let createDigitalAccountUseCase: CreateDigitalAccountUseCase;
  let getDigitalAccountUseCase: GetDigitalAccountUseCase;
  let deactivateDigitalAccountUseCase: DeactivateDigitalAccountUseCase;
  let statementRepository: StatementRepositoryPort;
  let depositIntoDigitalAccountUseCase: DepositMoneyIntoDigitalAccountUseCase;
  let withdrawMoneyFromDigitalAccountUseCase: WithdrawMoneyFromDigitalAccountUseCase;
  let getDigitalAccountStatementUseCase: GetDigitalAccountStatementUseCase;

  beforeEach(() => {
    accountHolderRepository = new AccountHolderFakeRepository();
    createAccountHolderUseCase = new CreateAccountHolderUseCase(accountHolderRepository);
    digitalAccountRepository = new DigitalAccountFakeRepository();
    createDigitalAccountUseCase = new CreateDigitalAccountUseCase(accountHolderRepository, digitalAccountRepository);
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
    getDigitalAccountStatementUseCase = new GetDigitalAccountStatementUseCase(
      digitalAccountRepository,
      statementRepository,
    );
  });

  it('should look for a digital account statement', async () => {
    const accountHolder = DtoFactoryHelper.makeCreateAccountHolderInput();
    // given
    const createdAccountHolder = await createAccountHolderUseCase.execute(accountHolder);
    const createdDigitalAccount = await createDigitalAccountUseCase.execute({ cpf: createdAccountHolder.cpf });
    const startDate = DateHelper.localToUTC();
    await DelayHelper.start(100);
    await depositIntoDigitalAccountUseCase.execute({ digitalAccountId: createdDigitalAccount.id, amount: 1000 });
    await DelayHelper.start(100);
    await withdrawMoneyFromDigitalAccountUseCase.execute({ digitalAccountId: createdDigitalAccount.id, amount: 500 });
    await DelayHelper.start(100);
    const digitalAccount = await getDigitalAccountUseCase.execute({ digitalAccountId: createdDigitalAccount.id });
    const endDate = DateHelper.localToUTC();
    await DelayHelper.start(100);
    await depositIntoDigitalAccountUseCase.execute({ digitalAccountId: createdDigitalAccount.id, amount: 1500 });

    //when
    const statement = await getDigitalAccountStatementUseCase.execute({
      digitalAccountId: digitalAccount.id,
      startDate,
      endDate,
    });

    //then
    expect(statement).toHaveLength(2);
    expect(statement[0]).toHaveProperty('type', AccountOperationType.WITHDRAW);
    expect(statement[0].balanceBefore + statement[0].amount).toBe(digitalAccount.balance);
    expect(statement[0]).toHaveProperty('createdAt', expect.any(Date));
  });

  it('should throw an exception if you try to fetch the statement of a digital account that does not exist', async () => {
    try {
      await getDigitalAccountStatementUseCase.execute({
        digitalAccountId: randomUUID(),
        startDate: DateHelper.localToUTC(),
        endDate: DateHelper.localToUTC(),
      });
      expect.unreachable();
    } catch (error) {
      expect((error as Error).message).toBe('digital account not found');
    }
  });

  it('should throw an exception if try to get a statement from a deactivated digital account', async () => {
    const accountHolder = DtoFactoryHelper.makeCreateAccountHolderInput();
    // given
    const createdAccountHolder = await createAccountHolderUseCase.execute(accountHolder);
    const createdDigitalAccount = await createDigitalAccountUseCase.execute({ cpf: createdAccountHolder.cpf });
    await deactivateDigitalAccountUseCase.execute({ digitalAccountId: createdDigitalAccount.id });

    try {
      // when
      await getDigitalAccountStatementUseCase.execute({
        digitalAccountId: createdDigitalAccount.id,
        startDate: DateHelper.localToUTC(),
        endDate: DateHelper.localToUTC(),
      });
      expect.unreachable();
    } catch (error) {
      // then
      expect((error as Error).message).toBe('digital account not found');
    }
  });
});
