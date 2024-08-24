import { Cpf } from '@src/cpf';
import { Chance } from 'chance';

const chance = new Chance();

describe('validate a cpf', () => {
  it('should validate a valid clean cpf', async () => {
    // given
    const validCpf = chance.cpf({ formatted: false });
    const cpf = new Cpf();

    // when
    const isValid = cpf.validate(validCpf);

    // then
    expect(isValid).toBeTruthy();
  });

  it('should validate a valid formated cpf', async () => {
    // given
    const validCpf = chance.cpf({ formatted: true });
    const cpf = new Cpf();

    // when
    const isValid = cpf.validate(validCpf);

    // then
    expect(isValid).toBeTruthy();
  });

  it('should validate an invalid cpf', async () => {
    // given
    const invalidCpf = '123.456.789-00';
    const cpf = new Cpf();

    // when
    const isValid = cpf.validate(invalidCpf);

    // then
    expect(isValid).toBeFalsy();
  });
});
