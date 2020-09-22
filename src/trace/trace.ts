export class Trace<T> {
  previous: Array<T> = Array.of()

  constructor(public message: string) {}
}
