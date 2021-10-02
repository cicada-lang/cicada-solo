import { CommandRunner } from "../command-runner"
import { Command } from "../command"
import * as Commands from "../commands"
import parse from "yargs-parser"
import ty, { Errors } from "@xieyuheng/ty"

export class CommonCommandRunner extends CommandRunner {
  commands: Record<string, Command<unknown>> = {}

  async run(): Promise<void> {
    const argv: any = parse(process.argv.slice(2))
    const name = argv["_"][0]

    if (this.commands[name]) {

      const command = this.commands[name]
      const positional = argv["_"].slice(1)

      for (const [i, key] of command.positional.entries()) {
        argv[key] = positional[i]
      }

      try {
        ty.object(command.schemas).validate(argv)
        return await command.execute(argv)
      } catch (error) {
        if (error instanceof Errors.InvalidData) {
          console.error(error)
          process.exit(1)
          return
        } else {
          throw error
        }
      }
    } else {
      const command = this.commands["default"]
      const positional = argv["_"]

      for (const [i, key] of command.positional.entries()) {
        argv[key] = positional[i]
      }

      try {
        ty.object(command.schemas).validate(argv)
        return await command.execute(argv)
      } catch (error) {
        if (error instanceof Errors.InvalidData) {
          console.error(error)
          process.exit(1)
          return
        } else {
          throw error
        }
      }
    }
  }

  register(name: string, command: Command<unknown>): void {
    this.commands[name] = command
  }
}
