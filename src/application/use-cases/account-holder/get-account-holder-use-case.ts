import { AccountHolderRepositoryPort } from '@src/ports/account-holder-repository-port';
import { UseCasePort } from '@src/ports/use-case-port';

export class GetAccountHolderUseCase
  implements UseCasePort<GetAccountHolderInputDTO, Promise<GetAccountHolderOutputDTO>>
{
  constructor(private readonly accountHolderRepository: AccountHolderRepositoryPort) {}

  async execute({ id }: GetAccountHolderInputDTO): Promise<GetAccountHolderOutputDTO> {
    const accountHolder = await this.accountHolderRepository.getById(id);
    if (!accountHolder) {
      throw new Error('account holder not found');
    }
    return accountHolder;
  }
}

export interface GetAccountHolderInputDTO {
  id: string;
}

export interface GetAccountHolderOutputDTO {
  id: string;
  name: string;
  cpf: string;
  createdAt: Date;
  updatedAt: Date;
}
