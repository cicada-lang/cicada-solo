import { Repl, ReplEvent, ReplEventHandler } from "../repl"
import Readline from "readline"
import fs from "fs"

export class ReadlineRepl extends Repl {
  handler: ReplEventHandler
  executed_statements: Array<string> = []
  commands: Array<Command> = [new Help(), new Load(), new Save()]

  constructor(opts: { handler: ReplEventHandler }) {
    super()
    this.handler = opts.handler
  }

  private readline_cache?: Readline.Interface

  get readline(): Readline.Interface {
    if (this.readline_cache) {
      return this.readline_cache
    } else {
      const { stdin: input, stdout: output } = process
      const readline = Readline.createInterface({ input, output })
      this.readline_cache = readline
      return readline
    }
  }

  prompt(): void {
    const depth = this.parens_checker.depth(this.lines.join("\n"))
    this.readline.setPrompt(this.create_prompt(depth))
    this.readline.prompt()
  }

  private create_prompt(depth: number): string {
    if (depth === 0) {
      return "> "
    } else {
      return "." + "..".repeat(depth) + " "
    }
  }

  run(): void {
    this.readline.on("line", (line) => this.handle_line(line))
    this.listen_sigint()
    this.listen_history()
    this.handler.greeting()
    this.prompt()
  }

  private lines: Array<string> = []
  private lock: boolean = false

  async handle_line(line: string): Promise<void> {
    this.lines.push(line)
    if (!this.lock) {
      this.lock = true
      await this.process_lines()
      this.lock = false
    }
  }

  private listen_history(): void {
    this.readline.on("history", (history) => {
      // TODO
    })
  }

  private listen_sigint(): void {
    let exit_attempt_count = 0

    this.readline.on("line", () => {
      exit_attempt_count = 0
    })

    this.readline.on("SIGINT", () => {
      if (this.lines.join("").trim() === "" && this.readline.line === "") {
        exit_attempt_count++
        if (exit_attempt_count === 1) {
          console.log()
          console.log("(To exit, press Ctrl+C again or Ctrl+D)")
        } else if (exit_attempt_count > 1) {
          this.readline.close()
        }
      } else {
        if (this.readline.line) {
          const line = this.readline.line
          this.readline.write("", { ctrl: true, name: "a" })
          this.readline.write("", { ctrl: true, name: "k" })
          // NOTE We should not erase last line on multi-line ctrl-c exit,
          //   we implement this by write the line back, in the case of multi-line.
          if (this.lines.length > 0) {
            process.stdout.write(line)
          }
        }
        if (this.lines.length > 0) {
          this.lines = []
          this.readline.write("\n")
        }
      }
    })
  }

  private async process_lines(): Promise<void> {
    while (true) {
      const text = this.next_text_or_report_error()

      if (!text) {
        this.prompt()
        return
      }

      for (const command of this.commands) {
        if (command.match(text)) {
          // NOTE We do not call `this.prompt` here,
          //   we let the command decide whether to call it.
          await command.run(this, text)
          return
        }
      }

      const event: ReplEvent = { text }
      await this.handler.handle(event)
      this.executed_statements.push(text)
    }
  }

  private next_text_or_report_error(): string | undefined {
    let text = ""
    for (const [i, line] of this.lines.entries()) {
      text += line + "\n"

      const result = this.parens_checker.check(text)

      if (result instanceof Error) {
        this.lines = []
        this.parens_checker.report_error(result)
        return
      } else if (result.kind === "lack") {
        // go on next loop
      } else if (result.kind === "balance") {
        if (text.trim() === "") {
          // go on next loop
        } else {
          this.lines = this.lines.splice(i + 1)
          return text
        }
      }
    }
  }
}

abstract class Command {
  abstract name: string
  abstract description: string
  abstract match(text: string): boolean
  abstract run(repl: ReadlineRepl, text: string): Promise<void>
}

class Help extends Command {
  name = "help"
  description = "Print this help message"

  match(text: string): boolean {
    const lines = text.trim().split("\n")
    if (lines.length !== 1) return false
    const [line] = lines
    return line.startsWith(".help")
  }

  async run(repl: ReadlineRepl, text: string): Promise<void> {
    const commands = repl.commands.map(
      ({ name, description }) => `.${name}   ${description}`
    )

    console.log(
      [
        ...commands,
        "",
        "Press Ctrl+C to abort current statement, Ctrl+D to exit the REPL",
      ].join("\n")
    )

    repl.prompt()
  }
}

class Save extends Command {
  name = "save"
  description = "Save all executed statements in this REPL session to a file"

  match(text: string): boolean {
    const lines = text.trim().split("\n")
    if (lines.length !== 1) return false
    const [line] = lines
    return line.startsWith(".save")
  }

  async run(repl: ReadlineRepl, text: string): Promise<void> {
    const line = text.trim()
    const path = line.slice(".save".length).trim()
    if (!path) {
      console.log("No file specified")
      console.log("  .save <file>")
      return
    }

    await fs.promises.writeFile(path, repl.executed_statements.join("\n"))
    console.log(`Session saved to file: "${path}"`)

    repl.prompt()
  }
}

class Load extends Command {
  name = "load"
  description = "Load a file into the REPL session"

  match(text: string): boolean {
    const lines = text.trim().split("\n")
    if (lines.length !== 1) return false
    const [line] = lines
    return line.startsWith(".load")
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
