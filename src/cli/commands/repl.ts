import { CicRepl } from "../cic-repl"

export const command = "repl [dir]"
export const description = "Run interactive REPL"
export const builder = {}

type Argv = {
  dir?: string
}

export const handler = async (argv: Argv) => {
  const dir = argv["dir"] || process.cwd()
  const repl = new CicRepl({ dir })
  await repl.run()
}
