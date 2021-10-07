export abstract class Logger {
  abstract info(input: string | Object): void
  abstract error(input: string | Object): void
}
