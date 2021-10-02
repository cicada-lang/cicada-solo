import { Command } from "./command"

export abstract class CommandRunner {
  abstract register(name: string, command: Command<unknown>): void
  abstract run(): void
}
