import fs from "fs"
import { Command } from "../command"
import { ReadlineRepl } from "../readline-repl"

export class Load extends Command {
  name = "load"
  description = "Load a file into the REPL session"

  matchLine(line: string): boolean {
    return Boolean(line.match(/\.load\b/))
  }

  async run(repl: ReadlineRepl, text: string): Promise<void> {
    const line = text.trim()
    const path = line.slice(".load".length).trim()
    if (!path) {
      console.log("No file specified")
      console.log("  .load <file>")
      return
    }

    repl.readline.write(await fs.promises.readFile(path, "utf8"))
  }
}
