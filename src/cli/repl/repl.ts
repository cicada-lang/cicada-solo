import { Library } from "../../library"
import { FakeFileResource } from "../../library/file-resources"
import pt from "@cicada-lang/partech"
import Readline from "readline"
import { customAlphabet } from "nanoid"
const nanoid = customAlphabet("1234567890abcdef", 16)
const pkg = require("../../../package.json")

export class Repl {
  rl = Readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  lines: Array<string> = []
  files: FakeFileResource
  library: Library
  path: string

  constructor(opts: { dir: string }) {
    this.path = `repl-file-${nanoid()}.cic`
    this.files = new FakeFileResource({
      dir: opts.dir,
      faked: { [this.path]: "" },
    })
    this.library = new Library({ files: this.files })
    this.rl.on("line", (line) => this.handle_line(line))
  }

  greeting(): void {
    console.log(`Welcome to Cicada ${pkg.version} *^-^*/`)
  }

  get text(): string {
    return this.lines.join("\n")
  }

  prompt(): void {
    const depth = pt.lexers.common.parens_depth(this.text)
    this.rl.setPrompt(this.create_prompt(depth))
    this.rl.prompt()
  }

  private create_prompt(depth: number): string {
    if (depth === 0) {
      return "> "
    } else {
      return "." + "..".repeat(depth) + " "
    }
  }

  run(): void {
    this.greeting()
    this.prompt()
  }

  private async commit(text: string): Promise<void> {
    const mod = await this.library.load(this.path)
    const index = mod.index

    try {
      const output = await mod.append(text).run()
      console.log(output)
    } catch (error) {
      const report = await this.library.reporter.error(error, this.path, {
        text,
      })
      console.error(report)
      mod.undo(index)
    }

    // NOTE For repl history.
    this.files.faked[this.path] += text
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
      await this.commit(text)
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
