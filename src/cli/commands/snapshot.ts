import { Command } from "../command"
import * as Runners from "../../runners"
import app from "../../app/node-app"
import Path from "path"

type Argv = {
  file: string
}

export class SnapshotCommand extends Command<Argv> {
  constructor() {
    super()
  }

  signature = "snapshot <file>"
  description = "Snapshot a file -- write to <file>.out"

  async execute(argv: Argv): Promise<void> {
    Command.assertFile(argv["file"])
    const path = Path.resolve(argv["file"])
    const library = await app.libraries.findUpOrFake(Path.dirname(path))
    const runner = Runners.create_special_runner({ path, library })
    const { error } = await runner.run(path)
    if (error) {
      process.exit(1)
    }
  }
}
