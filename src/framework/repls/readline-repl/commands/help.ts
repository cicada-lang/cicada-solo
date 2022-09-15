import { rightPad } from "../../../../utils/right-pad"
import { Command } from "../command"
import { ReadlineRepl } from "../readline-repl"

export class Help extends Command {
  name = "help"
  description = "Print this help message"

  matchLine(line: string): boolean {
    return Boolean(line.match(/\.help\b/))
  }

  async run(repl: ReadlineRepl, text: string): Promise<void> {
    const size = Math.max(...repl.commands.map(({ name }) => name.length))

    const commands = repl.commands.map(
      ({ name, description }) => `.${rightPad(name, size)}   ${description}`,
    )

    console.log(
      [
        "REPL commands:",
        ...commands.map((command) => "  " + command),
        "",
        "Press Ctrl+C to abort current statement, Ctrl+D to exit the REPL",
      ].join("\n"),
    )

    repl.prompt()
  }
}
