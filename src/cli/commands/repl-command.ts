import { Command } from "@xieyuheng/enchanter/lib/command"
import { ReadlineRepl } from "@xieyuheng/enchanter/lib/repls/readline-repl"
import app from "../../app/node-app"
import ty from "@xieyuheng/ty"
import Path from "path"

type Args = { dir?: string }

export class ReplCommand extends Command<Args> {
  name = "repl"

  description = "Run interactive REPL"

  args = { dir: ty.optional(ty.string()) }

  async execute(argv: Args): Promise<void> {
    const dir = Path.resolve(argv["dir"] || process.cwd())
    const path = `repl-file-${app.nanoid()}.cic`
    const book = app.books.fake(dir, { [path]: "" })
    const handler = app.createReplEventHandler({ path, book })
    const repl = await ReadlineRepl.create({ dir, handler, files: app.home })
    await repl.run()
  }
}
