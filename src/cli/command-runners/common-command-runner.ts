import { CommandRunner } from "../command-runner"
import { Command } from "../command"
import * as Commands from "../commands"
import parse from "yargs-parser"
import ty, { Schema, Errors } from "@xieyuheng/ty"

// export class HelpCommand extends Command<> {
// }

export class CommonCommandRunner extends CommandRunner {
  commands: Record<string, Command<any, any>> = {}
  defaultCommand?: Command<any, any>

  register(name: string, command: Command<any, any>): void {
    this.commands[name] = command
  }

  registerDefault(command: Command<any, any>): void {
    this.defaultCommand = command
  }

  async run(): Promise<void> {
    const argv = parse(process.argv.slice(2))
    const name = argv["_"][0]

    if (this.commands[name]) {
      await this.apply(this.commands[name], argv["_"].slice(1), argv)
    } else if (this.defaultCommand) {
      await this.apply(this.defaultCommand, argv["_"], argv)
    } else {
      console.error(`Unknown command: ${name}`)
      process.exit(1)
    }
  }

  async apply(
    command: Command<any, any>,
    array: Array<any>,
    obj: Record<string, any>
  ): Promise<void> {
    try {
      const args = this.pruneArgs(command.args, array)
      const options = ty.object(command.options).prune(obj)
      return await command.execute({ ...args, ...options })
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

  private pruneArgs(
    schemas: Record<string, Schema<any>>,
    array: Array<any>
  ): any {
    const args: any = {}

    let i = 0
    for (const [key, schema] of Object.entries(schemas)) {
      args[key] = schema.prune(array[i])
      i++
    }

    return args
  }
}
