import { DigitalAccounts as PrismaDigitalAccount } from '@prisma/client';
import { DigitalAccount } from '@src/ports/digital-account-repository-port';

export class DigitalAccountMapper {
  static toPrisma(digitalAccount: DigitalAccount): Omit<PrismaDigitalAccount, 'holderId' | 'deletedAt'> {
    return {
      id: digitalAccount.id,
      agency: digitalAccount.agency,
      accountNumber: digitalAccount.accountNumber,
      balance: digitalAccount.balance,
      isBlocked: digitalAccount.isBlocked,
      createdAt: digitalAccount.createdAt,
      updatedAt: digitalAccount.updatedAt,
    };
  }

  static toDomain(digitalAccount: PrismaDigitalAccount): DigitalAccount {
    return {
      id: digitalAccount.id,
      holderId: digitalAccount.holderId,
      agency: digitalAccount.agency,
      accountNumber: digitalAccount.accountNumber,
      balance: digitalAccount.balance,
      isBlocked: digitalAccount.isBlocked,
      createdAt: digitalAccount.createdAt,
      updatedAt: digitalAccount.updatedAt,
    };
  }
}
