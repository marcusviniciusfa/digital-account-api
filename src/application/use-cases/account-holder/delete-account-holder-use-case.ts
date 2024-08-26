import { AccountHolderRepositoryPort, UseCasePort } from '@src/ports';

export class DeleteAccountHolderUseCase
  implements UseCasePort<DeleteAccountHolderInputDTO, Promise<DeleteAccountHolderOutputDTO>>
{
  constructor(private readonly accountHolderRepository: AccountHolderRepositoryPort) {}

  async execute({ id }: DeleteAccountHolderInputDTO): Promise<void> {
    const accountHolderExists = await this.accountHolderRepository.getById(id);
    if (!accountHolderExists) {
      throw new Error('account holder not found');
    }
    await this.accountHolderRepository.delete(id);
  }
}

export interface DeleteAccountHolderInputDTO {
  id: string;
}

export type DeleteAccountHolderOutputDTO = void;
