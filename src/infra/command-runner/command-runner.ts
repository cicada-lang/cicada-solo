import { Command } from "../command"

export abstract class CommandRunner {
  abstract name: string
  abstract commands: Record<string, Command<any, any>>
  abstract defaultCommand?: Command<any, any>
  abstract run(): void
}
