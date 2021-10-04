import { Command } from "../../infra/command"
import { CommandRunner } from "../../infra/command-runner"
import * as ut from "../../ut"
import ty from "@xieyuheng/ty"
import nanocolors from "nanocolors"

type Args = { name?: string }

export class CommonHelpCommand extends Command<Args> {
  description = "Display help for a command"

  args = { name: ty.optional(ty.string()) }

  help(runner: CommandRunner): string {
    const name = nanocolors.blue("help")

    return [
      `The ${name} command displays help for a given command.`,
      ``,
      nanocolors.blue(`  ${runner.name} help help`),
    ].join("\n")
  }

  async execute(argv: Args, runner: CommandRunner): Promise<void> {
    if (argv["name"]) {
      this.helpCommand(argv["name"], runner)
    } else {
      this.usage()
      this.defaultCommand(runner)
      this.listCommands(runner)
      console.log()

      console.log(
        [
          //
          nanocolors.yellow(`Help:`),
          ut.indent(this.help(runner), "  "),
        ].join("\n")
      )
    }
  }

  helpCommand(name: string, runner: CommandRunner): void {
    const command = runner.commands[name]

    if (command === undefined) {
      console.log(`  I do not know a command named: ${name}`)
      console.log()
      this.listCommands(runner)
      return
    }

    console.log(
      [
        //
        nanocolors.yellow(`Description:`),
        `  ${command.description}`,
        ``,
      ].join("\n")
    )

    console.log(
      [
        //
        nanocolors.yellow(`Usage:`),
        `  ${nanocolors.blue(`${name} ${this.signature(command)}`)}`,
        ``,
      ].join("\n")
    )

    if (Object.entries(command.opts).length > 0) {
      const options = Object.entries(command.opts)
        .map(([key, schema]) => nanocolors.blue(`--${key}`))
        .join("\n")

      console.log(
        [
          //
          nanocolors.yellow(`Options:`),
          ut.indent(options, "  "),
          ``,
        ].join("\n")
      )
    }

    if (command.help) {
      console.log(
        [
          //
          nanocolors.yellow(`Help:`),
          ut.indent(command.help(runner), "  "),
        ].join("\n")
      )
    }
  }

  usage(): void {
    console.log(
      [
        //
        nanocolors.yellow(`Usage:`),
        `  command [arguments] [options]`,
        ``,
      ].join("\n")
    )
  }

  defaultCommand(runner: CommandRunner): void {
    if (runner.defaultCommand) {
      const command = runner.defaultCommand

      console.log(
        [
          nanocolors.yellow(`Default command:`),
          `  ${nanocolors.blue(this.signature(command))}  ${
            command.description
          }`,
          ``,
        ].join("\n")
      )
    }
  }

  listCommands(runner: CommandRunner): void {
    const size = Math.max(
      ...Object.entries(runner.commands).map(
        ([name, command]) => `${name} ${this.signature(command)}`.length
      )
    )

    console.log(nanocolors.yellow(`Commands:`))
    for (const [name, command] of Object.entries(runner.commands)) {
      const head = `${name} ${this.signature(command)}`
      console.log(
        [
          `  ${nanocolors.blue(ut.rightPad(head, size))}  ${
            command.description
          }`,
        ].join("\n")
      )
    }
  }

  signature(command: Command): string {
    return Object.keys(command.args)
      .map((key) => `[${key}]`)
      .join(" ")
  }
}
