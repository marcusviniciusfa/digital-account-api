import { AccountHolder, AccountHolderRepositoryPort } from '@src/ports/account-holder-repository-port';
import { FakeRepository } from '../../database/fake-repository';

export class AccountHolderFakeRepository extends FakeRepository<AccountHolder> implements AccountHolderRepositoryPort {
  constructor() {
    super();
  }

  async create(accountHolder: AccountHolder): Promise<AccountHolder> {
    this.inMemoryDatabase.set(accountHolder.id, accountHolder);
    return accountHolder;
  }

  async getById(id: string): Promise<AccountHolder | null> {
    const accountHolder = this.inMemoryDatabase.get(id);
    return accountHolder || null;
  }

  async getByCpf(cpf: string): Promise<AccountHolder | null> {
    let accountHolder: AccountHolder | null = null;
    this.inMemoryDatabase.forEach(someAccountHolder => {
      if (someAccountHolder.cpf === cpf) {
        accountHolder = someAccountHolder;
      }
    });
    return accountHolder;
  }

  async delete(id: string): Promise<void> {
    this.inMemoryDatabase.delete(id);
  }

  async update(accountHolder: AccountHolder): Promise<AccountHolder> {
    this.inMemoryDatabase.set(accountHolder.id, accountHolder);
    return accountHolder;
  }
}
