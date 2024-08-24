export interface AccountHolderRepositoryPort {
  create(accountHolder: AccountHolder): Promise<AccountHolder>;
  getById(id: string): Promise<AccountHolder | undefined>;
  getByCpf(cpf: string): Promise<AccountHolder | undefined>;
  update(accountHolder: Partial<AccountHolder>): Promise<AccountHolder>;
  delete(id: string): Promise<void>;
}

export type AccountHolder = {
  id: string;
  name: string;
  cpf: string;
  createdAt: Date;
  updatedAt: Date;
};
