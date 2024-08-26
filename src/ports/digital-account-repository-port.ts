export interface DigitalAccountRepositoryPort {
  create(digitalAccount: DigitalAccount): Promise<DigitalAccount>;
  getById(id: string): Promise<DigitalAccount | null>;
  getByHolderId(holderId: string): Promise<DigitalAccount[]>;
  update(digitalAccount: DigitalAccount): Promise<DigitalAccount>;
  delete(id: string): Promise<void>;
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
};
