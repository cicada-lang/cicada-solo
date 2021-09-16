import { Library } from "../../library"
import { FakeFileResource } from "../../library/file-resources"
import { DefaultRunner } from "../runners"
import pt from "@cicada-lang/partech"
const pkg = require("../../../package.json")
import Readline from "readline"
import { customAlphabet } from "nanoid"
const nanoid = customAlphabet("1234567890abcdef", 16)

export class Repl {
  rl = Readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  lines: Array<string> = []
  files: FakeFileResource
  library: Library
  runner: DefaultRunner
  path: string

  constructor(opts: { dir: string }) {
    this.path = `repl-file-${nanoid()}.cic`
    this.files = new FakeFileResource({
      dir: opts.dir,
      faked: {
        [this.path]: "",
      },
    })
    this.library = new Library({ files: this.files })
    this.runner = new DefaultRunner({
      library: this.library,
      files: this.files,
    })

    this.listen()
  }

  greeting(): void {
    console.log(`Welcome to Cicada ${pkg.version} ^-^/`)
  }

  get text(): string {
    return this.lines.join("\n")
  }

  prompt(): void {
    const depth = pt.lexers.common.parens_depth(this.text)
    this.rl.setPrompt(this.createPrompt(depth))
    this.rl.prompt()
  }

  private createPrompt(depth: number): string {
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

  private listen(): void {
    this.rl.on("line", async (line) => {
      const text = this.text + "\n" + line + "\n"
      const result = pt.lexers.common.parens_check(text)
      if (result.kind === "lack") {
        // NOTE save
        this.lines.push(line)
      } else if (result.kind === "balance") {
        // NOTE commit
        this.files.faked[this.path] += "\n" + text
        const { error } = await this.runner.run(this.path)
        if (error) {
          // TODO
          // console.log(error)
        }
        this.lines = []
      } else {
        // NOTE report error
        const report = pt.report(result.token.span, text)
        console.error()
        console.error(`Parentheses error: ${result.kind}`)
        console.error(report)
        this.lines = []
      }

      this.prompt()
    })
  }
}
