import { Command } from "../command"
import { ReadlineRepl } from "../readline-repl"

export class Help extends Command {
  name = "help"
  description = "Print this help message"

  match(text: string): boolean {
    const lines = text.trim().split("\n")
    if (lines.length !== 1) return false
    const [line] = lines
    return Boolean(line.match(/\.help\b/))
  }

  async run(repl: ReadlineRepl, text: string): Promise<void> {
    function right_pad(line: string, size: number): string {
      return line + " ".repeat(size - line.length)
    }

    const size = Math.max(...repl.commands.map(({ name }) => name.length))

    const commands = repl.commands.map(
      ({ name, description }) => `.${right_pad(name, size)}   ${description}`
    )

    console.log(
      [
        "REPL commands:",
        ...commands.map((command) => "  " + command),
        "",
        "Press Ctrl+C to abort current statement, Ctrl+D to exit the REPL",
      ].join("\n")
    )

    repl.prompt()
  }
}
