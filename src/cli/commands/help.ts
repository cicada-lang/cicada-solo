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
    const size = Math.max(
      ...Object.keys(runner.commands).map((name) => name.length)
    )

    for (const [name, command] of Object.entries(runner.commands)) {
      const message = `  ${ut.rightPad(name, size)}  ${command.description}`
      console.log(message)
    }
  }
}
