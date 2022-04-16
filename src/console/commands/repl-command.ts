import { Command } from "@enchanterjs/enchanter/lib/command"
import { CommandRunner } from "@enchanterjs/enchanter/lib/command-runner"
import Path from "path"
import app from "../../app/node-app"
import { ReadlineRepl } from "../../infra/repls/readline-repl"

type Args = {}

export class ReplCommand extends Command<Args> {
  name = "repl"

  description = "Open an interactive REPL"

  args = {}

  // prettier-ignore
  help(runner: CommandRunner): string {
    const { blue } = this.colors

    return [
      `The ${blue(this.name)} command takes you into a rabbit hole`,
      `  called REPL -- "Read Evaluate Print Loop".`,
      ``,
      `In which you can try some ideas real quick.`,
      ``,
      blue(`  ${runner.name} ${this.name}`),
      ``,
    ].join("\n")
  }

  async execute(argv: Args): Promise<void> {
    const repl = await ReadlineRepl.create({
      dir: Path.resolve(process.cwd()),
      handler: app.createReplEventHandler(),
      files: app.home,
    })

    await repl.run()
  }
}
