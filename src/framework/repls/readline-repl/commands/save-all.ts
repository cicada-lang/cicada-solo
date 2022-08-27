import fs from "fs"
import { Command } from "../command"
import { ReadlineRepl } from "../readline-repl"

export class SaveAll extends Command {
  name = "save_all"
  description = "Save all statements in this REPL session to a file"

  matchLine(line: string): boolean {
    return Boolean(line.match(/\.save_all\b/))
  }

  async run(repl: ReadlineRepl, text: string): Promise<void> {
    const line = text.trim()
    const path = line.slice(".save_all".length).trim()
    if (!path) {
      console.log("No file specified")
      console.log("  .save_all <file>")
      return
    }

    await fs.promises.writeFile(path, repl.allStmts.join("\n"))
    console.log(`Session saved to file: "${path}"`)

    repl.prompt()
  }
}
