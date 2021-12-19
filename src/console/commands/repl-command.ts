import { Command } from "@enchanterjs/enchanter/lib/command"
import { CommandRunner } from "@enchanterjs/enchanter/lib/command-runner"
import { ReadlineRepl } from "@enchanterjs/enchanter/lib/repls/readline-repl"
import ty from "@xieyuheng/ty"
import Path from "path"
import app from "../../app/node-app"

type Args = { dir?: string }

export class ReplCommand extends Command<Args> {
  name = "repl"

  description = "Open an interactive REPL"

  args = { dir: ty.optional(ty.string()) }

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
    const dir = Path.resolve(argv["dir"] || process.cwd())
    const path = `repl-file-${app.nanoid()}.cic`
    const handler = app.createReplEventHandler({ path })
    const repl = await ReadlineRepl.create({ dir, handler, files: app.home })
    await repl.run()
  }
}
