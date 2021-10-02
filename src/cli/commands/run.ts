import { Command } from "../command"
import * as Runners from "../../runners"
import app from "../../app/node-app"
import ty from "@xieyuheng/ty"
import Path from "path"

type Argv = { file: string }

export class RunCommand extends Command<Argv> {
  signature = "run <file>"
  description = "Run a file -- support .md or .cic"

  positional = ["file"]
  schemas = {
    file: ty.string()
  }

  async execute(argv: Argv): Promise<void> {
    Command.assertFile(argv["file"])
    const path = Path.resolve(argv["file"])
    const library = await app.libraries.findUpOrFake(Path.dirname(path))
    const runner = new Runners.DefaultRunner({ library })
    const { error } = await runner.run(path)
    if (error) {
      process.exit(1)
    }
  }
}
