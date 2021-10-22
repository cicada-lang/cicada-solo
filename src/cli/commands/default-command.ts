import { Command } from "@enchanterjs/enchanter/lib/command"
import { CommandRunner } from "@enchanterjs/enchanter/lib/command-runner"
import { CommonHelpCommand } from "@enchanterjs/enchanter/lib/commands"
import * as Commands from "../commands"
import app from "../../app/generic-app"
import ty from "@xieyuheng/ty"

type Args = { article?: string }
type Opts = { help?: boolean; version?: boolean }

export class DefaultCommand extends Command<Args, Opts> {
  name = "default"

  description = "Open REPL or run an article"

  args = { article: ty.optional(ty.string()) }
  opts = { help: ty.optional(ty.boolean()), version: ty.optional(ty.boolean()) }
  alias = { help: ["h"], version: ["v"] }

  async execute(argv: Args & Opts, runner: CommandRunner): Promise<void> {
    if (argv["help"]) {
      const command = new CommonHelpCommand()
      await command.execute({}, runner)
      return
    }

    if (argv["version"]) {
      console.log(app.config.pkg.version)
      return
    }

    const article = argv["article"]

    if (article === undefined) {
      const dir = process.cwd()
      const command = new Commands.ReplCommand()
      await command.execute({ dir })
    } else {
      const command = new Commands.RunCommand()
      await command.execute({ article })
    }
  }
}
