import { DateHelper } from '@src/helpers/date-helper';
import { AccountHolderRepositoryPort } from '@src/ports/account-holder-repository-port';
import { DigitalAccountRepositoryPort } from '@src/ports/digital-account-repository-port';
import { UseCasePort } from '@src/ports/use-case-port';
import { randomUUID } from 'crypto';

export class CreateDigitalAccountUseCase
  implements UseCasePort<CreateDigitalAccountInputDTO, Promise<CreateDigitalAccountOutputDTO>>
{
  constructor(
    private readonly accountHolderRepository: AccountHolderRepositoryPort,
    private readonly digitalAccountRepository: DigitalAccountRepositoryPort,
  ) {}

  async execute(input: CreateDigitalAccountInputDTO): Promise<CreateDigitalAccountOutputDTO> {
    const accountHould = await this.accountHolderRepository.getByCpf(input.cpf);
    if (!accountHould) {
      throw new Error('account holder not found');
    }
    const digitalAccount = {
      id: randomUUID(),
      holderId: accountHould.id,
      agency: (1).toString().padStart(4, '0'),
      balance: 0,
      isBlocked: false,
      createdAt: DateHelper.localToUTC(),
      updatedAt: DateHelper.localToUTC(),
    };
    const output = this.digitalAccountRepository.create(digitalAccount);
    return output;
  }
}

export interface CreateDigitalAccountInputDTO {
  cpf: string;
}

export interface CreateDigitalAccountOutputDTO {
  id: string;
  holderId: string;
  agency: string;
  balance: number;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}
