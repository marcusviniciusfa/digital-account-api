import { DateHelper } from '@src/helpers/date-helper';
import { DigitalAccount, DigitalAccountRepositoryPort } from '../../../ports/digital-account-repository-port';
import { DigitalAccountMapper } from '../mappers/digital-account-mapper';
import { prismaClient } from '../prisma-client';

export class DigitalAccountRepositoryPrisma implements DigitalAccountRepositoryPort {
  constructor() {}

  async create(digitalAccount: DigitalAccount): Promise<DigitalAccount> {
    await prismaClient.$connect();
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
      await prismaClient.$disconnect();
      return DigitalAccountMapper.toDomain(digitalAccountCreated);
    } catch (error) {
      await prismaClient.$disconnect();
      throw new Error('account number already exists', { cause: 'account_number_already_exists' });
    }
  }

  async getById(id: string): Promise<DigitalAccount | null> {
    await prismaClient.$connect();
    const digitalAccount = await prismaClient.digitalAccounts.findUnique({ where: { id, deletedAt: null } });
    await prismaClient.$disconnect();
    return digitalAccount ? DigitalAccountMapper.toDomain(digitalAccount) : null;
  }

  async getByHolderId(holderId: string): Promise<DigitalAccount[]> {
    await prismaClient.$connect();
    const digitalAccounts = await prismaClient.digitalAccounts.findMany({
      where: { holderId, deletedAt: null },
    });
    await prismaClient.$disconnect();
    return digitalAccounts.map(DigitalAccountMapper.toDomain);
  }

  async update(digitalAccount: DigitalAccount): Promise<DigitalAccount> {
    const { id, ...data } = DigitalAccountMapper.toPrisma(digitalAccount);
    await prismaClient.$connect();
    const digitalAccountCreated = await prismaClient.digitalAccounts.update({ where: { id }, data });
    await prismaClient.$disconnect();
    return DigitalAccountMapper.toDomain(digitalAccountCreated);
  }

  async delete(id: string): Promise<void> {
    await prismaClient.$connect();
    await prismaClient.digitalAccounts.update({ where: { id }, data: { deletedAt: DateHelper.localToUTC() } });
    await prismaClient.$disconnect();
  }
}
