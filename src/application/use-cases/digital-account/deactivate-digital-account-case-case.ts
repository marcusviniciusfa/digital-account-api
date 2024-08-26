import { DigitalAccountRepositoryPort } from '@src/ports/digital-account-repository-port';
import { UseCasePort } from '@src/ports/use-case-port';

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
