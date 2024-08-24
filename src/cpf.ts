export class Cpf {
  constructor() {}

  validate(rawCpf: string): boolean {
    const cleanCpf = this.clearCpf(rawCpf);
    const originalCheckDigits = cleanCpf.slice(9);
    const firstCheckDigit = this.calculateCheckDigit(cleanCpf, 10);
    const lastCheckDigit = this.calculateCheckDigit(cleanCpf, 11);
    const calculatedCheckDigits = `${firstCheckDigit}${lastCheckDigit}`;
    return originalCheckDigits === calculatedCheckDigits;
  }

  private clearCpf(cpf: string): string {
    return cpf.replace(/\D/g, '');
  }

  private calculateCheckDigit(cpf: string, factor: number) {
    let total = 0;
    for (const digit of cpf) {
      if (factor >= 2) {
        total += Number(digit) * factor--;
      }
    }
    const rest = total % 11;
    return rest < 2 ? 0 : 11 - rest;
  }
}
