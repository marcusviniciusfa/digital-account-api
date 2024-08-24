import { DigitalAccount, DigitalAccountRepositoryPort } from '@src/ports/digital-account-repository-port';

export class DigitalAccountFakeRepository implements DigitalAccountRepositoryPort {
  private inMemoryDatabase: Map<string, DigitalAccount>;

  constructor() {
    this.inMemoryDatabase = new Map<string, DigitalAccount>();
  }

  async create(digitalAccount: DigitalAccount): Promise<DigitalAccount> {
    if (this.inMemoryDatabase.size === 0) {
      digitalAccount.accountNumber = (1).toString().padStart(9, '0');
      this.inMemoryDatabase.set(digitalAccount.id, digitalAccount);
      return digitalAccount;
    }
    const accounts = Array.from(this.inMemoryDatabase.values());
    const accountsDescOrderByCreatedAt = accounts.sort(
      (accountA, accountB) => accountB.createdAt.getTime() - accountA.createdAt.getTime(),
    );
    const nextAccountNumber = Number(accountsDescOrderByCreatedAt[0].accountNumber) + 1;
    digitalAccount.accountNumber = nextAccountNumber.toString().padStart(9, '0');
    this.inMemoryDatabase.set(digitalAccount.id, digitalAccount);
    return digitalAccount;
  }

  async getById(id: string): Promise<DigitalAccount | undefined> {
    const digitalAccount = this.inMemoryDatabase.get(id);
    if (!digitalAccount?.deletedAt) {
      return digitalAccount;
    }
    return;
  }

  async update(digitalAccount: DigitalAccount): Promise<DigitalAccount> {
    this.inMemoryDatabase.set(digitalAccount.id, digitalAccount);
    return digitalAccount;
  }

  async getByHolderId(holderId: string): Promise<DigitalAccount[]> {
    const digitalAccountsByHolder: DigitalAccount[] = [];
    this.inMemoryDatabase.forEach(digitalAccount => {
      if (digitalAccount.holderId === holderId && !digitalAccount.deletedAt) {
        digitalAccountsByHolder.push(digitalAccount);
      }
    });
    return digitalAccountsByHolder;
  }
}
