import { Command } from "@xieyuheng/enchanter/lib/command"
import { CommandRunner } from "@xieyuheng/enchanter/lib/command-runner"
import * as Runners from "../../runners"
import app from "../../app/node-app"
import * as ut from "../../ut"
import ty from "@xieyuheng/ty"
import Path from "path"

type Args = { paper: string }

export class SnapshotCommand extends Command<Args> {
  name = "snapshot"

  description = "Take a snapshot of a paper"

  args = { paper: ty.string() }

  // prettier-ignore
  help(runner: CommandRunner): string {
    const { blue } = this.colors

    return [
      `The ${blue(this.name)} command take a snapshot of a paper,`,
      `recording its results into an output file,`,
      `named after the paper plus ${blue(".out")}`,
      ``,
      `It supports ${blue(".md")} and ${blue(".cic")} file extensions.`,
      ``,
      blue(`  ${runner.name} ${this.name} tests/trivial/sole.cic`),
      ``,
    ].join("\n")
  }

  async execute(argv: Args): Promise<void> {
    Command.assertFile(argv["paper"])
    const book = await app.books.findUpOrFake(Path.dirname(argv["paper"]))
    const path = Path.basename(argv["paper"])
    const runner = app.createLocalRunner({ path, book })
    const { error } = await runner.run(path)
    if (error) {
      process.exit(1)
    }
  }
}
