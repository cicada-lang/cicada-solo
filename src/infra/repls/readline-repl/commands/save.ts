import fs from "fs"
import { Command } from "../command"
import { ReadlineRepl } from "../readline-repl"

export class Save extends Command {
  name = "save"
  description = "Save successful statements in this REPL session to a file"

  matchLine(line: string): boolean {
    return Boolean(line.match(/\.save\b/))
  }

  async run(repl: ReadlineRepl, text: string): Promise<void> {
    const line = text.trim()
    const path = line.slice(".save".length).trim()
    if (!path) {
      console.log("No file specified")
      console.log("  .save <file>")
      return
    }

    await fs.promises.writeFile(path, repl.successfulStmts.join("\n"))
    console.log(`Session saved to file: "${path}"`)

    repl.prompt()
  }
}
