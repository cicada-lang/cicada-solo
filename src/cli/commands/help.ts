import { Command } from "../../infra/command"
import { CommandRunner } from "../../infra/command-runner"
import * as Commands from "../commands"
import * as ut from "../../ut"
import ty from "@xieyuheng/ty"
import chalk from "chalk"

type Args = { name?: string }

export class HelpCommand extends Command<Args> {
  description = "Display help for a command"

  args = { name: ty.optional(ty.string()) }

  async execute(argv: Args, runner: CommandRunner): Promise<void> {
    // TODO use argv["name"]

    this.usage()
    this.defaultCommand(runner)
    this.listCommands(runner)
  }

  usage(): void {
    console.log(
      [
        //
        chalk.yellow(`Usage:`),
        `  command [arguments] [options]`,
        ``,
      ].join("\n")
    )
  }

  defaultCommand(runner: CommandRunner): void {
    if (runner.default) {
      const command = runner.default

      console.log(
        [
          chalk.yellow(`Default command:`),
          `  ${chalk.blue(this.signature(command))}  ${command.description}`,
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

    console.log(chalk.yellow(`Commands:`))
    for (const [name, command] of Object.entries(runner.commands)) {
      const head = `${name} ${this.signature(command)}`
      console.log(
        [
          `  ${chalk.blue(ut.rightPad(head, size))}  ${command.description}`,
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
