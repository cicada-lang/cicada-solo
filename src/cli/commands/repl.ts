import { Repl } from "../repl"
export const command = "repl [dir]"
export const description = "Run interactive REPL"
export const builder = {}

type Argv = {
  dir?: string
}

export const handler = async (argv: Argv) => {
  const dir = argv["dir"] || process.cwd()
  const repl = new Repl({ dir })
  await repl.run()
  return
}
