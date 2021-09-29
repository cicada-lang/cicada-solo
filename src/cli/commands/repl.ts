import { CicReplEventHandler } from "../../repl-event-handlers"
import { ReadlineRepl } from "../../repls/readline-repl"
import { Library } from "../../library"
import { FakeFileResource } from "../../file-resources"
import { customAlphabet } from "nanoid"
const nanoid = customAlphabet("1234567890abcdef", 16)

export const command = "repl [dir]"
export const description = "Run interactive REPL"
export const builder = {}

type Argv = {
  dir?: string
}

export const handler = async (argv: Argv) => {
  const dir = argv["dir"] || process.cwd()

  const path = `repl-file-${nanoid()}.cic`
  const library = new Library({
    config: Library.fake_config(),
    files: new FakeFileResource({ dir, faked: { [path]: "" } }),
  })
  const handler = new CicReplEventHandler({ path, library })
  const repl = new ReadlineRepl({ handler })
  await repl.run()
}
