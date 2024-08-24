import { DateHelper } from '@src/helpers/date-helper';
import { DigitalAccountRepositoryPort } from '@src/ports/digital-account-repository-port';
import { UseCasePort } from '@src/ports/use-case-port';

export class BlockDigitalAccountUseCase
  implements UseCasePort<BlockDigitalAccountInputDTO, Promise<BlockDigitalAccountOutputDTO>>
{
  constructor(private readonly digitalAccountRepository: DigitalAccountRepositoryPort) {}

  async execute(input: BlockDigitalAccountInputDTO): Promise<BlockDigitalAccountOutputDTO> {
    const digitalAccount = await this.digitalAccountRepository.getById(input.digitalAccountId);
    if (!digitalAccount) {
      throw new Error('digital account not found');
    }
    if (digitalAccount.isBlocked) {
      throw new Error('digital account is already blocked');
    }
    const blockedDigitalAccount = {
      ...digitalAccount,
      isBlocked: true,
      updatedAt: DateHelper.localToUTC(),
    };
    await this.digitalAccountRepository.update(blockedDigitalAccount);
  }
}

export interface BlockDigitalAccountInputDTO {
  digitalAccountId: string;
}

export type BlockDigitalAccountOutputDTO = void;
