import { DateHelper } from '@src/helpers/date-helper';
import { AccountHolderRepositoryPort } from '@src/ports/account-holder-repository-port';
import { UseCasePort } from '@src/ports/use-case-port';

export class UpdateAccountHolderUseCase
  implements UseCasePort<UpdateAccountHolderInputDTO, Promise<UpdateAccountHolderOutputDTO>>
{
  constructor(private readonly accountHolderRepository: AccountHolderRepositoryPort) {}

  async execute(input: UpdateAccountHolderInputDTO): Promise<UpdateAccountHolderOutputDTO> {
    const accountHolderExists = await this.accountHolderRepository.getById(input.id);
    if (!accountHolderExists) {
      throw new Error('account holder not found');
    }
    const accountHolder = {
      ...accountHolderExists,
      name: input.name,
      updatedAt: DateHelper.localToUTC(),
    };
    const output = await this.accountHolderRepository.update(accountHolder);
    return output;
  }
}

export interface UpdateAccountHolderInputDTO {
  id: string;
  name: string;
}

export interface UpdateAccountHolderOutputDTO {
  id: string;
  name: string;
  cpf: string;
  createdAt: Date;
  updatedAt: Date;
}
