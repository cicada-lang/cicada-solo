import { Repl, ReplEvent, ReplEventHandler } from "../repl"
import Readline from "readline"
import pt from "@cicada-lang/partech"

export class ReadlineRepl extends Repl {
  handler: ReplEventHandler

  constructor(opts: { handler: ReplEventHandler }) {
    super()
    this.handler = opts.handler
  }

  readline_cache?: Readline.Interface

  lines: Array<string> = []

  run(): void {
    this.readline.on("line", (line) => this.handle_line(line))
    this.handler.greeting()
    this.prompt()
  }

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

  get text(): string {
    return this.lines.join("\n")
  }

  prompt(): void {
    const depth = pt.lexers.common.parens_depth(this.text)
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

  lock = false

  private async handle_line(line: string): Promise<void> {
    const text = (this.text + "\n" + line).trim()

    const result = pt.lexers.common.parens_check(text)

    if (this.lock) {
      this.lines.push(line)
      return
    }

    if (result.kind === "lack") {
      this.lines.push(line)
    } else {
      this.lines = []
    }

    if (result.kind === "balance") {
      this.lock = true
      await this.handler.handle({ text })
      this.lock = false
    }

    if (result.kind === "mismatch") {
      this.log_parens_error({
        msg: "Parentheses mismatch",
        token: result.token,
        text,
      })
    }

    if (result.kind === "excess") {
      this.log_parens_error({
        msg: "Parentheses mismatch",
        token: result.token,
        text,
      })
    }

    this.prompt()
  }

  private log_parens_error(opts: {
    msg: string
    token: pt.Token
    text: string
  }): void {
    const { msg, token, text } = opts

    console.error()
    console.error(`${msg}:`)
    console.error(pt.report(token.span, text))
  }
}
