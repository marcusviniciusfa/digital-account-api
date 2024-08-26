import { DigitalAccountRepositoryPort, UseCasePort } from '@src/ports';

export class GetDigitalAccountUseCase
  implements UseCasePort<GetDigitalAccountInputDTO, Promise<GetDigitalAccountOutputDTO>>
{
  constructor(private readonly digitalAccountRepository: DigitalAccountRepositoryPort) {}

  async execute(input: GetDigitalAccountInputDTO): Promise<GetDigitalAccountOutputDTO> {
    const digitalAccount = await this.digitalAccountRepository.getById(input.digitalAccountId);
    if (!digitalAccount) {
      throw new Error('digital account not found');
    }
    return digitalAccount;
  }
}

export interface GetDigitalAccountInputDTO {
  digitalAccountId: string;
}

export interface GetDigitalAccountOutputDTO {
  id: string;
  holderId: string;
  agency: string;
  accountNumber: string;
  balance: number;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}
