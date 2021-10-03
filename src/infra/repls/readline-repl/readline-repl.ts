import { Repl, ReplEvent, ReplEventHandler } from "../../repl"
import { AppFileStore } from "../../../app"
import { Command } from "./command"
import * as Commands from "./commands"
import app from "../../../app/node-app"
import Readline from "readline"

export class ReadlineRepl extends Repl {
  dir: string
  handler: ReplEventHandler
  all_statements: Array<string> = []
  successful_statements: Array<string> = []
  commands: Array<Command> = [
    new Commands.Help(),
    new Commands.Load(),
    new Commands.Save(),
    new Commands.SaveAll(),
  ]
  files: AppFileStore
  readline: Readline.Interface

  constructor(opts: {
    dir: string
    handler: ReplEventHandler
    files: AppFileStore
    readline: Readline.Interface
  }) {
    super()
    this.dir = opts.dir
    this.handler = opts.handler
    this.files = opts.files
    this.readline = opts.readline
  }

  static async create(opts: {
    dir: string
    handler: ReplEventHandler
  }): Promise<ReadlineRepl> {
    const text = await app.files.get("repl/history")
    const history = text ? text.trim().split("\n").reverse() : []

    const readline = Readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      history,
      historySize: 1000,
    })

    return new ReadlineRepl({
      dir: opts.dir,
      handler: opts.handler,
      files: app.files,
      readline,
    })
  }

  prompt(): void {
    const depth = this.parensChecker.depth(this.lines.join("\n"))
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

  async run(): Promise<void> {
    this.readline.on("line", (line) => this.handle_line(line))
    this.listen_sigint()
    this.listen_history()
    this.handler.greeting()
    this.prompt()
  }

  private lines: Array<string> = []
  private lock: boolean = false

  private async handle_line(line: string): Promise<void> {
    this.lines.push(line)
    if (!this.lock) {
      this.lock = true
      await this.process_lines()
      this.lock = false
    }
  }

  private listen_history(): void {
    this.readline.on("history", (history) => {
      const text = history.reverse().join("\n") + "\n"
      this.files.put("repl/history", text)
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
      const successful = await this.handler.handle(event)
      this.all_statements.push(text)
      if (successful) {
        this.successful_statements.push(text)
      }
    }
  }

  private next_text_or_report_error(): string | undefined {
    let text = ""
    for (const [i, line] of this.lines.entries()) {
      const prefix = "  ".repeat(this.parensChecker.depth(text))

      text += prefix + line + "\n"

      const result = this.parensChecker.check(text)

      if (result instanceof Error) {
        this.lines = []
        this.parensChecker.reportError(result)
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
