import { DateHelper } from '@src/helpers';
import {
  AccountHolder,
  AccountHolderRepositoryPort,
  DigitalAccount,
  DigitalAccountRepositoryPort,
  UseCasePort,
} from '@src/ports';
import { randomInt, randomUUID } from 'crypto';

export class CreateDigitalAccountUseCase
  implements UseCasePort<CreateDigitalAccountInputDTO, Promise<CreateDigitalAccountOutputDTO>>
{
  constructor(
    private readonly accountHolderRepository: AccountHolderRepositoryPort,
    private readonly digitalAccountRepository: DigitalAccountRepositoryPort,
  ) {}

  async execute(input: CreateDigitalAccountInputDTO): Promise<CreateDigitalAccountOutputDTO> {
    const accountHolder = await this.accountHolderRepository.getByCpf(input.cpf);
    if (!accountHolder) {
      throw new Error('account holder not found');
    }
    // O ideal seria fazer uma chamada assíncrona para um microsserviço de criação de conta digital para ele se encarregar de criar o número da conta
    const digitalAccountCreated = await this.tryCreateDigitalAccount(accountHolder);
    return digitalAccountCreated;
  }

  async tryCreateDigitalAccount(accountHolder: AccountHolder): Promise<DigitalAccount> {
    const digitalAccountToCreate = this.makeDigitalAccount(accountHolder);
    try {
      const digitalAccountCreated = await this.digitalAccountRepository.create(digitalAccountToCreate);
      return digitalAccountCreated;
    } catch (error) {
      if ((error as Error).cause === 'account_number_already_exists') {
        return this.tryCreateDigitalAccount(accountHolder);
      }
      throw error;
    }
  }

  makeDigitalAccount(accountHolder: AccountHolder): DigitalAccount {
    return {
      id: randomUUID(),
      holderId: accountHolder.id,
      agency: (1).toString().padStart(4, '0'),
      accountNumber: randomInt(1, 999999999).toString().padStart(9, '0'),
      balance: 0,
      isBlocked: false,
      createdAt: DateHelper.localToUTC(),
      updatedAt: DateHelper.localToUTC(),
    };
  }
}

export interface CreateDigitalAccountInputDTO {
  cpf: string;
}

export interface CreateDigitalAccountOutputDTO {
  id: string;
  holderId: string;
  agency: string;
  accountNumber: string;
  balance: number;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}
