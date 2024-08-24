import {
  AccountOperation,
  getAllByDigitalAccountOptions,
  OrderDirection,
  StatementRepositoryPort,
} from '@src/ports/statement-repository-port';

const DEFAULT_ORDER_DIRECTION = OrderDirection.DESC;

export class StatementFakeRepository implements StatementRepositoryPort {
  private inMemoryDatabase: Map<string, AccountOperation>;

  constructor() {
    this.inMemoryDatabase = new Map<string, AccountOperation>();
  }

  async create(accountOperation: AccountOperation): Promise<AccountOperation> {
    this.inMemoryDatabase.set(accountOperation.id, accountOperation);
    return accountOperation;
  }

  async getAllByDigitalAccount(
    digitalAccountId: string,
    { startDate, endDate, type, order = DEFAULT_ORDER_DIRECTION }: getAllByDigitalAccountOptions,
  ): Promise<AccountOperation[]> {
    const accountOperations = Array.from(this.inMemoryDatabase.values());

    if (order === OrderDirection.DESC) {
      accountOperations.sort(
        (accountOperationA, accountOperationB) =>
          accountOperationB.createdAt.getTime() - accountOperationA.createdAt.getTime(),
      );
    }

    if (order === OrderDirection.ASC) {
      accountOperations.sort(
        (accountOperationA, accountOperationB) =>
          accountOperationA.createdAt.getTime() - accountOperationB.createdAt.getTime(),
      );
    }

    const accountOperationTypeFilter = (accountOperation: AccountOperation) => {
      if (!type) {
        return true;
      }
      return accountOperation.type === type;
    };

    const dateFilter = (accountOperation: AccountOperation) => {
      return startDate <= accountOperation.createdAt && accountOperation.createdAt <= endDate;
    };

    const digitalAccountFilter = (accountOperation: AccountOperation) => {
      return accountOperation.digitalAccountId === digitalAccountId;
    };

    const accountOperationsBeforeFilters = accountOperations
      .filter(digitalAccountFilter)
      .filter(dateFilter)
      .filter(accountOperationTypeFilter);

    return accountOperationsBeforeFilters;
  }
}
