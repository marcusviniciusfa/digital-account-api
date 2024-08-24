export abstract class FakeRepository<T> {
  protected inMemoryDatabase: Map<string, T>;

  constructor() {
    this.inMemoryDatabase = new Map<string, T>();
  }

  async count(): Promise<number> {
    return this.inMemoryDatabase.size;
  }
}
