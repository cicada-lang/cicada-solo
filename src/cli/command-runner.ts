import { Command } from "./command"

export abstract class CommandRunner {
  abstract commands: Record<string, Command<any, any>>
  abstract default?: Command<any, any>
  abstract run(): void
}
