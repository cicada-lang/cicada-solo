import { Command } from "../../infra/command"
import { CommandRunner } from "../../infra/command-runner"
import * as Commands from "../commands"
import * as ut from "../../ut"
import ty from "@xieyuheng/ty"

type Args = { name?: string }

export class HelpCommand extends Command<Args> {
  description = "Display help for a command"

  args = { name: ty.optional(ty.string()) }

  async execute(argv: Args, runner: CommandRunner): Promise<void> {
    // TODO use argv["name"]

    const size = Math.max(
      ...Object.keys(runner.commands).map((name) => name.length)
    )

    console.log(
      [
        //
        `Usage:`,
        `  command [arguments] [options]`,
        ``,
      ].join("\n")
    )

    if (runner.default) {
      const command = runner.default

      console.log(
        [
          //
          `Default command:`,
          `  ${command.description}`,
          ``,
        ].join("\n")
      )
    }

    console.log("Commands:")
    for (const [name, command] of Object.entries(runner.commands)) {
      console.log(`  ${ut.rightPad(name, size)}  ${command.description}`)
    }
  }

  // signature(name: string, command: Commands):
}
