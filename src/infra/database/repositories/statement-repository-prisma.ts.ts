import { StatementAccountMapper } from '../mappers/statemente-mapper';
import { prismaClient } from '../prisma-client';
import {
  AccountOperation,
  AccountOperationType,
  getAllByDigitalAccountOptions,
  OrderDirection,
  StatementRepositoryPort,
} from './../../../ports/statement-repository-port';

const DEFAULT_ORDER_DIRECTION = OrderDirection.DESC;

export class StatementRepositoryPrisma implements StatementRepositoryPort {
  constructor() {}

  async create(accountOperation: AccountOperation): Promise<AccountOperation> {
    await prismaClient.$connect();
    const accountOperationCreated = await prismaClient.accountOperations.create({
      data: {
        digitalAccount: {
          connect: {
            id: accountOperation.digitalAccountId,
          },
        },
        ...StatementAccountMapper.toPrisma(accountOperation),
      },
    });
    await prismaClient.$disconnect();
    return StatementAccountMapper.toDomain(accountOperationCreated);
  }

  async getAllByDigitalAccount(
    digitalAccountId: string,
    { startDate, endDate, type, order = DEFAULT_ORDER_DIRECTION }: getAllByDigitalAccountOptions,
  ): Promise<AccountOperation[]> {
    await prismaClient.$connect();
    const accountOperation = await prismaClient.accountOperations.findMany({
      where: {
        digitalAccountId,
        type: type ? AccountOperationType[type] : undefined,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        createdAt: order,
      },
    });
    await prismaClient.$disconnect();
    return accountOperation.map(StatementAccountMapper.toDomain);
  }
}
