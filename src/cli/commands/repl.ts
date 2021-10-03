import { Command } from "../../infra/command"
import { CicReplEventHandler } from "../../repl-event-handlers"
import { ReadlineRepl } from "../../infra/repls/readline-repl"
import app from "../../app/node-app"
import ty from "@xieyuheng/ty"
import Path from "path"

type Args = { dir?: string }

export class ReplCommand extends Command<Args> {
  description = "Run interactive REPL"

  args = { dir: ty.optional(ty.string()) }

  async execute(argv: Args): Promise<void> {
    const dir = Path.resolve(argv["dir"] || process.cwd())
    const path = `repl-file-${app.nanoid()}.cic`
    const library = app.libraries.fake(dir, { [path]: "" })
    const handler = new CicReplEventHandler({ path, library })
    const repl = await ReadlineRepl.create({ dir, handler })
    await repl.run()
  }
}
