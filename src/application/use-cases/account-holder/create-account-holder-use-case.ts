import { Cpf } from '@src/cpf';
import { DateHelper } from '@src/helpers/date-helper';
import { AccountHolderRepositoryPort } from '@src/ports/account-holder-repository-port';
import { UseCasePort } from '@src/ports/use-case-port';
import { randomUUID } from 'crypto';

export class CreateAccountHolderUseCase
  implements UseCasePort<CreateAccountHolderInputDTO, Promise<CreateAccountHolderOutputDTO>>
{
  constructor(private readonly accountHolderRepository: AccountHolderRepositoryPort) {}

  async execute(input: CreateAccountHolderInputDTO): Promise<CreateAccountHolderOutputDTO> {
    const cpfInstance = new Cpf();
    const isValid = cpfInstance.validate(input.cpf);
    if (!isValid) {
      throw new Error('invalid cpf');
    }
    const isAlreadyAccountHolderWithCpf = await this.accountHolderRepository.getByCpf(input.cpf);
    if (isAlreadyAccountHolderWithCpf) {
      throw new Error('account holder already exists');
    }
    const accountHolder = {
      id: randomUUID(),
      ...input,
      createdAt: DateHelper.localToUTC(),
      updatedAt: DateHelper.localToUTC(),
    };
    const output = await this.accountHolderRepository.create(accountHolder);
    return output;
  }
}

export interface CreateAccountHolderInputDTO {
  name: string;
  cpf: string;
}

export interface CreateAccountHolderOutputDTO {
  id: string;
  name: string;
  cpf: string;
  createdAt: Date;
  updatedAt: Date;
}
