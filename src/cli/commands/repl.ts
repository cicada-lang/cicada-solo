import { Command } from "../command"
import { CicReplEventHandler } from "../../repl-event-handlers"
import { ReadlineRepl } from "../../repls/readline-repl"
import { Library } from "../../library"
import { FakeFileStore } from "../../file-stores"
import { customAlphabet } from "nanoid"
const nanoid = customAlphabet("1234567890abcdef", 16)
import Path from "path"

type Argv = {
  dir?: string
}

export class ReplCommand extends Command<Argv> {
  signature = "repl [dir]"
  description = "Run interactive REPL"

  async execute(argv: Argv): Promise<void> {
    const dir = Path.resolve(argv["dir"] || process.cwd())

    const path = `repl-file-${nanoid()}.cic`
    const library = new Library({
      config: Library.fake_config(),
      files: new FakeFileStore({ dir, faked: { [path]: "" } }),
    })
    const handler = new CicReplEventHandler({ path, library })
    const repl = await ReadlineRepl.create({ dir, handler })

    await repl.run()
  }
}
