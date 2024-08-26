import { DateHelper } from '@src/helpers';
import { AccountOperationType, DigitalAccountRepositoryPort, StatementRepositoryPort, UseCasePort } from '@src/ports';
import { randomUUID } from 'crypto';

const DAILY_LIMIT = 2000;

export class WithdrawMoneyFromDigitalAccountUseCase
  implements UseCasePort<WithdrawMoneyFromDigitalAccountInputDTO, Promise<WithdrawMoneyFromDigitalAccountOutputDTO>>
{
  constructor(
    private readonly digitalAccountRepository: DigitalAccountRepositoryPort,
    private readonly statementRepository: StatementRepositoryPort,
  ) {}

  async execute(input: WithdrawMoneyFromDigitalAccountInputDTO): Promise<WithdrawMoneyFromDigitalAccountOutputDTO> {
    if (input.amount <= 0) {
      throw new Error('invalid amount');
    }
    const hasDailyLimit = await this.validateDailyLimit(input.digitalAccountId, input.amount);
    if (!hasDailyLimit) {
      throw new Error('amount exceeds daily limit');
    }
    const digitalAccount = await this.digitalAccountRepository.getById(input.digitalAccountId);
    if (!digitalAccount) {
      throw new Error('digital account not found');
    }
    if (digitalAccount.isBlocked) {
      throw new Error('digital account is blocked');
    }
    if (digitalAccount.balance < input.amount) {
      throw new Error('insufficient balance');
    }
    const date = DateHelper.localToUTC();
    const digitalAccountToUpdate = {
      ...digitalAccount,
      balance: digitalAccount.balance - input.amount,
      updatedAt: date,
    };
    const output = await this.digitalAccountRepository.update(digitalAccountToUpdate);
    if (output) {
      await this.statementRepository.create({
        id: randomUUID(),
        digitalAccountId: digitalAccount.id,
        type: AccountOperationType.WITHDRAW,
        amount: -input.amount,
        balanceBefore: digitalAccount.balance,
        createdAt: date,
      });
    }
    return output;
  }

  private async validateDailyLimit(digitalAccountId: string, amount: number): Promise<boolean> {
    if (amount > DAILY_LIMIT) {
      return false;
    }
    const startDate = DateHelper.startOfDayUTC();
    const endDate = DateHelper.endOfDayUTC();
    const accountOperations = await this.statementRepository.getAllByDigitalAccount(digitalAccountId, {
      type: AccountOperationType.WITHDRAW,
      startDate,
      endDate,
    });
    console.log(accountOperations);
    const totalWithdrawnToday = accountOperations.reduce((total, accountOperation) => {
      return total + Math.abs(accountOperation.amount);
    }, 0);
    console.log(totalWithdrawnToday);
    return totalWithdrawnToday + amount > DAILY_LIMIT ? false : true;
  }
}

export interface WithdrawMoneyFromDigitalAccountInputDTO {
  digitalAccountId: string;
  amount: number;
}

export interface WithdrawMoneyFromDigitalAccountOutputDTO {
  id: string;
  holderId: string;
  agency: string;
  balance: number;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}
