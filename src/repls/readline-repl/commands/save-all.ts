import { Command } from "../command"
import { ReadlineRepl } from "../readline-repl"
import fs from "fs"

export class SaveAll extends Command {
  name = "save_all"
  description = "Save all statements in this REPL session to a file"

  match(text: string): boolean {
    const lines = text.trim().split("\n")
    if (lines.length !== 1) return false
    const [line] = lines
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

    await fs.promises.writeFile(path, repl.all_statements.join("\n"))
    console.log(`Session saved to file: "${path}"`)

    repl.prompt()
  }
}
