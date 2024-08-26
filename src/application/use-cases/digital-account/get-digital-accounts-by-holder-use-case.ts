import { DigitalAccountRepositoryPort, UseCasePort } from '@src/ports';

export class GetDigitalAccountsByHolderUseCase
  implements UseCasePort<GetDigitalAccountsByHolderInputDTO, Promise<GetDigitalAccountsByHolderOutputDTO[]>>
{
  constructor(private readonly digitalAccountRepository: DigitalAccountRepositoryPort) {}

  async execute(input: GetDigitalAccountsByHolderInputDTO): Promise<GetDigitalAccountsByHolderOutputDTO[]> {
    const digitalAccounts = await this.digitalAccountRepository.getByHolderId(input.holderId);
    return digitalAccounts;
  }
}

export interface GetDigitalAccountsByHolderInputDTO {
  holderId: string;
}

export interface GetDigitalAccountsByHolderOutputDTO {
  id: string;
  holderId: string;
  agency: string;
  accountNumber: string;
  balance: number;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}
