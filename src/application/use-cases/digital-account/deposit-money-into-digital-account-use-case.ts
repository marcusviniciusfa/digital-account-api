import { DateHelper } from '@src/helpers';
import { AccountOperationType, DigitalAccountRepositoryPort, StatementRepositoryPort, UseCasePort } from '@src/ports';
import { randomUUID } from 'crypto';

export class DepositMoneyIntoDigitalAccountUseCase
  implements UseCasePort<DepositMoneyIntoDigitalAccountInputDTO, Promise<DepositMoneyIntoDigitalAccountOutputDTO>>
{
  constructor(
    private readonly digitalAccountRepository: DigitalAccountRepositoryPort,
    private readonly statementRepository: StatementRepositoryPort,
  ) {}

  async execute(input: DepositMoneyIntoDigitalAccountInputDTO): Promise<DepositMoneyIntoDigitalAccountOutputDTO> {
    if (input.amount <= 0) {
      throw new Error('invalid amount');
    }
    const digitalAccount = await this.digitalAccountRepository.getById(input.digitalAccountId);
    if (!digitalAccount) {
      throw new Error('digital account not found');
    }
    if (digitalAccount.isBlocked) {
      throw new Error('digital account is blocked');
    }
    const date = DateHelper.localToUTC();
    const digitalAccountToUpdate = {
      ...digitalAccount,
      balance: digitalAccount.balance + input.amount,
      updatedAt: date,
    };
    const output = await this.digitalAccountRepository.update(digitalAccountToUpdate);
    if (output) {
      await this.statementRepository.create({
        id: randomUUID(),
        digitalAccountId: digitalAccount.id,
        type: AccountOperationType.DEPOSIT,
        amount: input.amount,
        balanceBefore: digitalAccount.balance,
        createdAt: date,
      });
    }
    return output;
  }
}

export interface DepositMoneyIntoDigitalAccountInputDTO {
  digitalAccountId: string;
  amount: number;
}

export interface DepositMoneyIntoDigitalAccountOutputDTO {
  id: string;
  holderId: string;
  agency: string;
  accountNumber: string;
  balance: number;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}
