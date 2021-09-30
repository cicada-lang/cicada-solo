import { CicReplEventHandler } from "../../repl-event-handlers"
import { ReadlineRepl } from "../../repls/readline-repl"
import { Library } from "../../library"
import { FakeFileStore } from "../../file-stores"
import { customAlphabet } from "nanoid"
const nanoid = customAlphabet("1234567890abcdef", 16)
import Path from "path"

export const command = "repl [dir]"
export const description = "Run interactive REPL"
export const builder = {}

type Argv = {
  dir?: string
}

export const handler = async (argv: Argv) => {
  const dir = Path.resolve(argv["dir"] || process.cwd())

  const path = `repl-file-${nanoid()}.cic`
  const library = new Library({
    config: Library.fake_config(),
    files: new FakeFileStore({ dir, faked: { [path]: "" } }),
  })
  const handler = new CicReplEventHandler({ path, library })
  // const repl = await ReadlineRepl.create({ dir, handler })
  const repl = new ReadlineRepl({ dir, handler })
  await repl.run()
}
