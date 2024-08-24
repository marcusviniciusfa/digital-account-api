import { AccountHolderRepositoryPort } from '@src/ports/account-holder-repository-port';
import { UseCasePort } from '@src/ports/use-case-port';

export class DeleteAccountHolderUseCase
  implements UseCasePort<DeleteAccountHolderInputDTO, Promise<DeleteAccountHolderOutputDTO>>
{
  constructor(private readonly accountHolderRepository: AccountHolderRepositoryPort) {}

  async execute({ id }: DeleteAccountHolderInputDTO): Promise<void> {
    await this.accountHolderRepository.delete(id);
  }
}

export interface DeleteAccountHolderInputDTO {
  id: string;
}

export type DeleteAccountHolderOutputDTO = void;
