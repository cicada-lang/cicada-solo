import { ReadlineRepl } from "./readline-repl"

export abstract class Command {
  abstract name: string
  abstract description: string

  match(text: string): boolean {
    const lines = text.trim().split("\n")
    if (lines.length !== 1) return false
    const [line] = lines
    return this.matchLine(line)
  }

  abstract matchLine(line: string): boolean
  abstract run(repl: ReadlineRepl, text: string): Promise<void>
}
