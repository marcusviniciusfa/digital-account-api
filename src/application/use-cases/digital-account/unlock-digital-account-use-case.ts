import { DateHelper } from '@src/helpers';
import { DigitalAccountRepositoryPort, UseCasePort } from '@src/ports';

export class UnblockDigitalAccountUseCase
  implements UseCasePort<UnblockDigitalAccountInputDTO, Promise<UnblockDigitalAccountOutputDTO>>
{
  constructor(private readonly digitalAccountRepository: DigitalAccountRepositoryPort) {}

  async execute(input: UnblockDigitalAccountInputDTO): Promise<UnblockDigitalAccountOutputDTO> {
    const digitalAccount = await this.digitalAccountRepository.getById(input.digitalAccountId);
    if (!digitalAccount) {
      throw new Error('digital account not found');
    }
    if (!digitalAccount.isBlocked) {
      throw new Error('digital account is not blocked');
    }
    const unlockedDigitalAccount = {
      ...digitalAccount,
      isBlocked: false,
      updatedAt: DateHelper.localToUTC(),
    };
    await this.digitalAccountRepository.update(unlockedDigitalAccount);
  }
}

export interface UnblockDigitalAccountInputDTO {
  digitalAccountId: string;
}

export type UnblockDigitalAccountOutputDTO = void;
