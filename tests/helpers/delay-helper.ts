export class DelayHelper {
  static async start(milliseconds: number) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }
}
