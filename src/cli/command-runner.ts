import { Command } from "./command"

export type RegisterOptions = {
  default?: boolean
}

export abstract class CommandRunner {
  abstract register(command: Command<unknown>, opts?: RegisterOptions): void
  abstract run(): void
}
