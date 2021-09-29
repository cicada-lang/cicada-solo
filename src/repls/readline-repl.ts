import { Repl, ReplEvent, ReplEventHandler } from "../repl"
import Readline from "readline"
import fs from "fs"

export class ReadlineRepl extends Repl {
  handler: ReplEventHandler
  executed_statements: Array<string> = []

  constructor(opts: { handler: ReplEventHandler }) {
    super()
    this.handler = opts.handler
  }

  private readline_cache?: Readline.Interface

  private get readline(): Readline.Interface {
    if (this.readline_cache) {
      return this.readline_cache
    } else {
      const { stdin: input, stdout: output } = process
      const readline = Readline.createInterface({ input, output })
      this.readline_cache = readline
      return readline
    }
  }

  private prompt(): void {
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
    this.listen_line()
    this.listen_sigint()
    this.listen_history()
    this.handler.greeting()
    this.prompt()
  }

  private lines: Array<string> = []
  private lock = false

  private listen_line(): void {
    this.readline.on("line", async (line) => {
      this.lines.push(line)
      if (!this.lock) {
        this.lock = true
        await this.process_lines()
        this.lock = false
      }
    })
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
          this.readline.write("", { ctrl: true, name: "a" })
          this.readline.write("", { ctrl: true, name: "k" })
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
      if (text) {
        if (text.trim() === ".help") {
          console.log(
            [
              ".help   Print this help message",
              // ".load   Load a file into the REPL session",
              // ".save   Save all executed statements in this REPL session to a file",
              "",
              "Press Ctrl+C to abort current statement, Ctrl+D to exit the REPL",
            ].join("\n")
          )
        } else {
          const event: ReplEvent = { text }
          await this.handler.handle(event)
          this.executed_statements.push(text)
        }
      } else {
        this.prompt()
        return
      }
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
