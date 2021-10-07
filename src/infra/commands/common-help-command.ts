import { Command } from "../../infra/command"
import { CommandRunner } from "../../infra/command-runner"
import * as ut from "../../ut"
import ty from "@xieyuheng/ty"

type Args = { name?: string }

export class CommonHelpCommand extends Command<Args> {
  name = "help"

  description = "Display help for a command"

  args = { name: ty.optional(ty.string()) }

  help(runner: CommandRunner): string {
    const name = ut.colors.blue(this.name)

    return [
      `The ${name} command displays help for a given command.`,
      ``,
      ut.colors.blue(`  ${runner.name} help help`),
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
          ut.colors.yellow(`Help:`),
          ut.indent(this.help(runner), "  "),
        ].join("\n")
      )
    }
  }

  helpCommand(name: string, runner: CommandRunner): void {
    const command = runner.commands.find((command) => command.name === name)

    if (command === undefined) {
      console.log(`  I do not know a command named: ${name}`)
      console.log()
      this.listCommands(runner)
      return
    }

    console.log(
      [
        //
        ut.colors.yellow(`Description:`),
        `  ${command.description}`,
        ``,
      ].join("\n")
    )

    console.log(
      [
        //
        ut.colors.yellow(`Usage:`),
        `  ${ut.colors.blue(`${name} ${this.signature(command)}`)}`,
        ``,
      ].join("\n")
    )

    if (Object.entries(command.opts).length > 0) {
      const options = Object.entries(command.opts)
        .map(([key, schema]) => ut.colors.blue(`--${key}`))
        .join("\n")

      console.log(
        [
          //
          ut.colors.yellow(`Options:`),
          ut.indent(options, "  "),
          ``,
        ].join("\n")
      )
    }

    if (command.help) {
      console.log(
        [
          //
          ut.colors.yellow(`Help:`),
          ut.indent(command.help(runner), "  "),
        ].join("\n")
      )
    }
  }

  usage(): void {
    console.log(
      [
        //
        ut.colors.yellow(`Usage:`),
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
          ut.colors.yellow(`Default command:`),
          `  ${ut.colors.blue(this.signature(command))}  ${
            command.description
          }`,
          ``,
        ].join("\n")
      )
    }
  }

  listCommands(runner: CommandRunner): void {
    const size = Math.max(
      ...runner.commands.map(
        (command) => `${command.name} ${this.signature(command)}`.length
      )
    )

    console.log(ut.colors.yellow(`Commands:`))
    for (const command of runner.commands) {
      const head = `${command.name} ${this.signature(command)}`
      console.log(
        [
          `  ${ut.colors.blue(ut.rightPad(head, size))}  ${
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
