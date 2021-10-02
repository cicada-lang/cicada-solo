import { Command } from "../command"
import { ReplCommand, RunCommand } from "../commands"

type Argv = { file?: string }

export class DefaultCommand extends Command<Argv> {
  signature = "$0 [file]"
  description = "Open REPL or run a file"

  async execute(argv: Argv): Promise<void> {
    const file = argv["file"]

    if (file === undefined) {
      const dir = process.cwd()
      const command = new ReplCommand()
      await command.execute({ dir })
    } else {
      const command = new RunCommand()
      await command.execute({ file })
    }
  }
}
