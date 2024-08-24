import { CreateAccountHolderInputDTO } from '@src/application/use-cases/account-holder/create-account-holder-use-case';
import { Chance } from 'chance';

const chance = new Chance();

export class DtoFactoryHelper {
  static makeCreateAccountHolderInput({
    name = chance.name(),
    cpf = chance.cpf(),
  }: {
    name?: string;
    cpf?: string;
  } = {}): CreateAccountHolderInputDTO {
    return { name, cpf };
  }

  static makeUpdateAccountHolderInput({ id, name = chance.name() }: { id: string; name?: string }) {
    return { id, name };
  }
}
