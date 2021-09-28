import { CicReplEventHandler } from "../cic-repl-event-handler"
import { ReadlineRepl } from "../../repls/readline-repl"

export const command = "repl [dir]"
export const description = "Run interactive REPL"
export const builder = {}

type Argv = {
  dir?: string
}

export const handler = async (argv: Argv) => {
  const dir = argv["dir"] || process.cwd()
  const handler = new CicReplEventHandler({ dir })
  const repl = new ReadlineRepl({ handler })
  await repl.run()
}
