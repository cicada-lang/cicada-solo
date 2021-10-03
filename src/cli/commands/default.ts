import { Command } from "../../infra/command"
import { CommandRunner } from "../../infra/command-runner"
import * as Commands from "../commands"
import ty from "@xieyuheng/ty"

type Args = { file?: string }
type Opts = { help?: boolean }

export class DefaultCommand extends Command<Args, Opts> {
  description = "Open REPL or run a file"

  args = { file: ty.optional(ty.string()) }
  opts = { help: ty.optional(ty.boolean()) }

  alias = { help: ["h"] }

  async execute(argv: Args & Opts, runner: CommandRunner): Promise<void> {
    if (argv["help"]) {
      const command = new Commands.HelpCommand()
      await command.execute({}, runner)
      return
    }

    const file = argv["file"]

    if (file === undefined) {
      const dir = process.cwd()
      const command = new Commands.ReplCommand()
      await command.execute({ dir })
    } else {
      const command = new Commands.RunCommand()
      await command.execute({ file })
    }
  }
}
