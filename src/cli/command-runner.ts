import { Command } from "./command"

export abstract class CommandRunner {
  abstract register(command: Command<unknown>): void
  abstract run(): void
}
