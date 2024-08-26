export interface AccountHolderRepositoryPort {
  create(accountHolder: AccountHolder): Promise<AccountHolder>;
  getById(id: string): Promise<AccountHolder | null>;
  getByCpf(cpf: string): Promise<AccountHolder | null>;
  update(accountHolder: AccountHolder): Promise<AccountHolder>;
  delete(id: string): Promise<void>;
}

export type AccountHolder = {
  id: string;
  name: string;
  cpf: string;
  createdAt: Date;
  updatedAt: Date;
};
