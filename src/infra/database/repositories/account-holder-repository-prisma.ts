import { AccountHolder, AccountHolderRepositoryPort } from '../../../ports/account-holder-repository-port';
import { AccountHolderMapper } from '../mappers/account-holder-mapper';
import { prismaClient } from '../prisma-client';

export class AccountHolderRepositoryPrisma implements AccountHolderRepositoryPort {
  constructor() {}

  async create(accountHolder: AccountHolder): Promise<AccountHolder> {
    const accountHolderCreated = await prismaClient.accountHolders.create({
      data: AccountHolderMapper.toPrisma(accountHolder),
    });
    return AccountHolderMapper.toDomain(accountHolderCreated);
  }

  async getById(id: string): Promise<AccountHolder | null> {
    const accountHolderCreated = await prismaClient.accountHolders.findUnique({ where: { id } });
    return accountHolderCreated ? AccountHolderMapper.toDomain(accountHolderCreated) : null;
  }

  async getByCpf(cpf: string): Promise<AccountHolder | null> {
    const accountHolderCreated = await prismaClient.accountHolders.findUnique({ where: { cpf } });
    return accountHolderCreated ? AccountHolderMapper.toDomain(accountHolderCreated) : null;
  }

  async update(accountHolder: AccountHolder): Promise<AccountHolder> {
    const { id, ...data } = AccountHolderMapper.toPrisma(accountHolder);
    const accountHolderCreated = await prismaClient.accountHolders.update({ where: { id }, data });
    return AccountHolderMapper.toDomain(accountHolderCreated);
  }

  async delete(id: string): Promise<void> {
    await prismaClient.accountHolders.delete({ where: { id } });
  }
}
