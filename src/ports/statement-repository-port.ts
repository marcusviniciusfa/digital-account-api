export interface StatementRepositoryPort {
  create(accountOperation: AccountOperation): Promise<AccountOperation>;
  getAllByDigitalAccount(digitalAccountId: string, options: getAllByDigitalAccountOptions): Promise<AccountOperation[]>;
}

export enum OrderDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export enum AccountOperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

export const AccountOperationTypeValues = {
  deposit: AccountOperationType.DEPOSIT,
  withdraw: AccountOperationType.WITHDRAW,
};

export interface getAllByDigitalAccountOptions {
  startDate: Date;
  endDate: Date;
  type?: AccountOperationType;
  order?: OrderDirection;
}

export type AccountOperation = {
  id: string;
  digitalAccountId: string;
  balanceBefore: number;
  type: AccountOperationType;
  amount: number;
  createdAt: Date;
};
