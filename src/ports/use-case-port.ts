export interface UseCasePort<T, U> {
  execute(input: T): U;
}
