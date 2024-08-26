import { $Enums, AccountOperations as PrismaAccountOperation } from '@prisma/client';
import { AccountOperation, AccountOperationType } from '../../../ports/statement-repository-port';

export class StatementAccountMapper {
  static toPrisma(accountOperation: AccountOperation): Omit<PrismaAccountOperation, 'digitalAccountId'> {
    return {
      id: accountOperation.id,
      type: $Enums.AccountOperationType[accountOperation.type],
      amount: accountOperation.amount,
      balanceBefore: accountOperation.balanceBefore,
      createdAt: accountOperation.createdAt,
    };
  }

  static toDomain(accountOperation: PrismaAccountOperation): AccountOperation {
    return {
      id: accountOperation.id,
      digitalAccountId: accountOperation.digitalAccountId,
      type: AccountOperationType[accountOperation.type],
      amount: accountOperation.amount,
      balanceBefore: accountOperation.balanceBefore,
      createdAt: accountOperation.createdAt,
    };
  }
}
