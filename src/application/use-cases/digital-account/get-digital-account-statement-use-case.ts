import { DigitalAccountRepositoryPort } from '@src/ports/digital-account-repository-port';
import { AccountOperationType, OrderDirection, StatementRepositoryPort } from '@src/ports/statement-repository-port';
import { UseCasePort } from '@src/ports/use-case-port';

export class GetDigitalAccountStatementUseCase
  implements UseCasePort<GetDigitalAccountStatementInputDTO, Promise<GetDigitalAccountStatementOutputDTO[]>>
{
  constructor(
    private readonly digitalAccountRepository: DigitalAccountRepositoryPort,
    private readonly statementRepository: StatementRepositoryPort,
  ) {}

  async execute({
    digitalAccountId,
    endDate,
    startDate,
    order,
  }: GetDigitalAccountStatementInputDTO): Promise<GetDigitalAccountStatementOutputDTO[]> {
    const digitalAccount = await this.digitalAccountRepository.getById(digitalAccountId);
    if (!digitalAccount) {
      throw new Error('digital account not found');
    }
    const statement = await this.statementRepository.getAllByDigitalAccount(digitalAccountId, {
      startDate,
      endDate,
      order,
    });
    return statement;
  }
}

export interface GetDigitalAccountStatementInputDTO {
  digitalAccountId: string;
  startDate: Date;
  endDate: Date;
  order?: OrderDirection;
}

export interface GetDigitalAccountStatementOutputDTO {
  id: string;
  digitalAccountId: string;
  balanceBefore: number;
  type: AccountOperationType;
  amount: number;
  createdAt: Date;
}
