import { Command } from "../../infra/command"
import * as Runners from "../../runners"
import app from "../../app/node-app"
import ty from "@xieyuheng/ty"
import Path from "path"

type Args = { file: string }

export class SnapshotCommand extends Command<Args> {
  description = "Snapshot a file -- write to <file>.out"

  args = { file: ty.string() }

  async execute(argv: Args): Promise<void> {
    Command.assertFile(argv["file"])
    const path = Path.resolve(argv["file"])
    const library = await app.libraries.findUpOrFake(Path.dirname(path))
    const runner = Runners.createSpecialRunner({ path, library })
    const { error } = await runner.run(path)
    if (error) {
      process.exit(1)
    }
  }
}
