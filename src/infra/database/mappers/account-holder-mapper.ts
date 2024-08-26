import { AccountHolders as PrismaAccountHolder } from '@prisma/client';
import { AccountHolder } from '@src/ports/account-holder-repository-port';

export class AccountHolderMapper {
  static toPrisma(accountHolder: AccountHolder): PrismaAccountHolder {
    return {
      id: accountHolder.id,
      name: accountHolder.name,
      cpf: accountHolder.cpf,
      createdAt: accountHolder.createdAt,
      updatedAt: accountHolder.updatedAt,
    };
  }

  static toDomain(accountHolder: PrismaAccountHolder): AccountHolder {
    return {
      id: accountHolder.id,
      name: accountHolder.name,
      cpf: accountHolder.cpf,
      createdAt: accountHolder.createdAt,
      updatedAt: accountHolder.updatedAt,
    };
  }
}
