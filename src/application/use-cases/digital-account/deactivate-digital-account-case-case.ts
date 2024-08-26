import { DigitalAccountRepositoryPort, UseCasePort } from '@src/ports';

export class DeactivateDigitalAccountUseCase
  implements UseCasePort<DeactivateDigitalAccountInputDTO, Promise<DeactivateDigitalAccountOutputDTO>>
{
  constructor(private readonly digitalAccountRepository: DigitalAccountRepositoryPort) {}

  async execute({ digitalAccountId }: DeactivateDigitalAccountInputDTO): Promise<DeactivateDigitalAccountOutputDTO> {
    const digitalAccount = await this.digitalAccountRepository.getById(digitalAccountId);
    if (!digitalAccount) {
      throw new Error('digital account not found');
    }
    await this.digitalAccountRepository.delete(digitalAccountId);
  }
}

export interface DeactivateDigitalAccountInputDTO {
  digitalAccountId: string;
}

export type DeactivateDigitalAccountOutputDTO = void;
