import { Command } from "../command"
import * as Commands from "../commands"
import ty from "@xieyuheng/ty"

type Args = { file?: string }

export class DefaultCommand extends Command<Args> {
  description = "Open REPL or run a file"

  args = { file: ty.optional(ty.string()) }

  async execute(argv: Args): Promise<void> {
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
