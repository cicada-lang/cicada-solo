import { CommandRunner } from "../command-runner"
import { Command } from "../command"
import parse from "yargs-parser"
import ty, { Schema, Errors } from "@xieyuheng/ty"

export class CommonCommandRunner extends CommandRunner {
  commands: Record<string, Command<any, any>>
  default?: Command<any, any>

  constructor(opts: {
    commands: Record<string, Command<any, any>>
    default?: Command<any, any>
  }) {
    super()
    this.commands = opts.commands
    this.default = opts.default
  }

  async run(): Promise<void> {
    const argv = parse(process.argv.slice(2))
    const name = argv["_"][0]

    if (this.commands[name]) {
      await this.apply(this.commands[name], argv["_"].slice(1), argv)
    } else if (this.default) {
      await this.apply(this.default, argv["_"], argv)
    } else {
      console.error(
        [
          `I was given a command name that I do not know how to handle.`,
          `  name: ${name}`,
        ].join("\n")
      )
      process.exit(1)
    }
  }

  async apply(
    command: Command<any, any>,
    array: Array<any>,
    record: Record<string, any>
  ): Promise<void> {
    const args = this.pruneArgs(command.args, array)
    const opts = this.pruneOpts(command.opts, record)
    return await command.execute({ ...args, ...opts }, this)
  }

  private pruneOpts(
    schemas: Record<string, Schema<any>>,
    record: Record<string, any>
  ): any {
    const opts: any = {}
    for (const [key, schema] of Object.entries(schemas)) {
      try {
        opts[key] = schema.prune(record[key])
      } catch (error) {
        if (error instanceof Errors.InvalidData) {
          console.error(
            [
              `I found invalid input in options.`,
              `  key: ${key}`,
              `  give: ${record[key]}`,
              `  expect: ${JSON.stringify(schema.json())}`,
            ].join("\n")
          )
          process.exit(1)
          return
        } else {
          throw error
        }
      }
    }

    return opts
  }

  private pruneArgs(
    schemas: Record<string, Schema<any>>,
    array: Array<any>
  ): any {
    let i = 0

    const args: any = {}
    for (const [key, schema] of Object.entries(schemas)) {
      try {
        args[key] = schema.prune(array[i])
        i++
      } catch (error) {
        if (error instanceof Errors.InvalidData) {
          console.error(
            [
              `I found invalid input in positional args.`,
              `  name: ${key}`,
              `  index: ${i}`,
              `  give: ${array[i]}`,
              `  expect: ${JSON.stringify(schema.json())}`,
            ].join("\n")
          )
          process.exit(1)
          return
        } else {
          throw error
        }
      }
    }

    return args
  }
}
