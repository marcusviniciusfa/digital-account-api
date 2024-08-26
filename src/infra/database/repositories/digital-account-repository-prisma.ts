import { DateHelper } from '@src/helpers/date-helper';
import { DigitalAccount, DigitalAccountRepositoryPort } from '../../../ports/digital-account-repository-port';
import { DigitalAccountMapper } from '../mappers/digital-account-mapper';
import { prismaClient } from '../prisma-client';

export class DigitalAccountRepositoryPrisma implements DigitalAccountRepositoryPort {
  constructor() {}

  async create(digitalAccount: DigitalAccount): Promise<DigitalAccount> {
    try {
      const digitalAccountToCreate = prismaClient.digitalAccounts.create({
        data: {
          holder: {
            connect: {
              id: digitalAccount.holderId,
            },
          },
          ...DigitalAccountMapper.toPrisma(digitalAccount),
        },
      });
      const [digitalAccountCreated] = await prismaClient.$transaction([digitalAccountToCreate]);
      return DigitalAccountMapper.toDomain(digitalAccountCreated);
    } catch (error) {
      throw new Error('account number already exists', { cause: 'account_number_already_exists' });
    }
  }

  async getById(id: string): Promise<DigitalAccount | null> {
    const digitalAccount = await prismaClient.digitalAccounts.findUnique({ where: { id, deletedAt: null } });
    return digitalAccount ? DigitalAccountMapper.toDomain(digitalAccount) : null;
  }

  async getByHolderId(holderId: string): Promise<DigitalAccount[]> {
    const digitalAccounts = await prismaClient.digitalAccounts.findMany({
      where: { holderId, deletedAt: null },
    });
    return digitalAccounts.map(DigitalAccountMapper.toDomain);
  }

  async update(digitalAccount: DigitalAccount): Promise<DigitalAccount> {
    const { id, ...data } = DigitalAccountMapper.toPrisma(digitalAccount);
    const digitalAccountCreated = await prismaClient.digitalAccounts.update({ where: { id }, data });
    return DigitalAccountMapper.toDomain(digitalAccountCreated);
  }

  async delete(id: string): Promise<void> {
    await prismaClient.digitalAccounts.update({ where: { id }, data: { deletedAt: DateHelper.localToUTC() } });
  }
}
