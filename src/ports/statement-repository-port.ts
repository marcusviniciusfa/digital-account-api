export interface StatementRepositoryPort {
  create(accountOperation: AccountOperation): Promise<AccountOperation>;
  getAllByDigitalAccount(digitalAccountId: string, options: getAllByDigitalAccountOptions): Promise<AccountOperation[]>;
}

export enum OrderDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export enum AccountOperationType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
}

export interface getAllByDigitalAccountOptions {
  startDate: Date;
  endDate: Date;
  type?: keyof typeof AccountOperationType;
  order?: OrderDirection;
}

export type AccountOperation = {
  id: string;
  digitalAccountId: string;
  balanceBefore: number;
  type: keyof typeof AccountOperationType;
  amount: number;
  createdAt: Date;
};
