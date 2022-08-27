import Readline from "readline"
import { FileStore } from "../../file-store"
import { Repl, ReplEvent, ReplEventHandler } from "../../repl"
import { Command } from "./command"
import * as Commands from "./commands"

export class ReadlineRepl extends Repl {
  dir: string
  handler: ReplEventHandler
  allStmts: Array<string> = []
  successfulStmts: Array<string> = []
  commands: Array<Command> = [
    new Commands.Help(),
    new Commands.Load(),
    new Commands.Save(),
    new Commands.SaveAll(),
  ]
  files: FileStore
  readline: Readline.Interface

  constructor(opts: {
    dir: string
    handler: ReplEventHandler
    files: FileStore
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
    files: FileStore
  }): Promise<ReadlineRepl> {
    const text = await opts.files.get("repl/history")
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
      files: opts.files,
      readline,
    })
  }

  prompt(): void {
    const depth = this.parensChecker.depth(this.lines.join("\n"))
    this.readline.setPrompt(this.createPrompt(depth))
    this.readline.prompt()
  }

  private createPrompt(depth: number): string {
    if (depth === 0) {
      return "> "
    } else {
      return "." + "..".repeat(depth) + " "
    }
  }

  async run(): Promise<void> {
    this.readline.on("line", (line) => this.handleLine(line))
    this.listenSigint()
    this.listenHistory()
    this.handler.greeting()
    this.prompt()
  }

  private lines: Array<string> = []
  private lock: boolean = false

  private async handleLine(line: string): Promise<void> {
    this.lines.push(line)
    if (!this.lock) {
      this.lock = true
      await this.processLines()
      this.lock = false
    }
  }

  private listenHistory(): void {
    this.readline.on("history", (history) => {
      // NOTE Be careful, do not do side effect on `history`.
      const text = [...history].reverse().join("\n") + "\n"
      this.files.set("repl/history", text)
    })
  }

  private listenSigint(): void {
    let exitAttemptCount = 0

    this.readline.on("line", () => {
      exitAttemptCount = 0
    })

    this.readline.on("SIGINT", () => {
      if (this.lines.join("").trim() === "" && this.readline.line === "") {
        exitAttemptCount++
        if (exitAttemptCount === 1) {
          console.log()
          console.log("(To exit, press Ctrl+C again or Ctrl+D)")
        } else if (exitAttemptCount > 1) {
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

  private async processLines(): Promise<void> {
    while (true) {
      const text = this.nextTextOrReportError()

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
      this.allStmts.push(text)
      if (successful) {
        this.successfulStmts.push(text)
      }
    }
  }

  private nextTextOrReportError(): string | undefined {
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
