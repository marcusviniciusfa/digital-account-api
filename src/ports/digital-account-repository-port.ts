export interface DigitalAccountRepositoryPort {
  create(digitalAccount: Omit<DigitalAccount, 'accountNumber'>): Promise<DigitalAccount>;
  getById(id: string): Promise<DigitalAccount | undefined>;
  getByHolderId(holderId: string): Promise<DigitalAccount[]>;
  update(digitalAccount: DigitalAccount): Promise<DigitalAccount>;
}

export type DigitalAccount = {
  id: string;
  holderId: string;
  agency: string;
  accountNumber: string;
  balance: number;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};
