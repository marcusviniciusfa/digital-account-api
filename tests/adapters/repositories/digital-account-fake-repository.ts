import { DigitalAccount, DigitalAccountRepositoryPort } from '@src/ports/digital-account-repository-port';

export class DigitalAccountFakeRepository implements DigitalAccountRepositoryPort {
  private inMemoryDatabase: Map<string, DigitalAccount & { deletedAt?: Date }>;

  constructor() {
    this.inMemoryDatabase = new Map<string, DigitalAccount & { deletedAt?: Date }>();
  }

  async create(digitalAccount: DigitalAccount): Promise<DigitalAccount> {
    let accountNumberExists = false;
    this.inMemoryDatabase.forEach(account => {
      if (account.accountNumber === digitalAccount.accountNumber) {
        accountNumberExists = true;
      }
    });
    if (accountNumberExists) {
      throw new Error('account number already exists', { cause: 'account_number_already_exists' });
    }
    this.inMemoryDatabase.set(digitalAccount.id, digitalAccount);
    return digitalAccount;
  }

  async getById(id: string): Promise<DigitalAccount | null> {
    const digitalAccount = this.inMemoryDatabase.get(id);
    if (!digitalAccount?.deletedAt) {
      return digitalAccount || null;
    }
    return null;
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

  async delete(id: string): Promise<void> {
    this.inMemoryDatabase.delete(id);
  }
}
