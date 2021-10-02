import { Command } from "./command"

export abstract class CommandRunner {
  abstract register(name: string, command: Command<any, any>): void
  abstract registerDefault(command: Command<any, any>): void
  abstract run(): void
}
