import Readline from "readline"
import pt from "@cicada-lang/partech"
const pkg = require("../../package.json")

export class Repl {
  async run(): Promise<void> {
    const rl = Readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    let lines: Array<string> = []

    console.log(`Welcome to Cicada ${pkg.version} ^-^/`)

    rl.prompt()
    rl.on("line", (line) => {
      const text = [...lines, line].join("\n")
      const result = pt.lexers.common.parens_check(text)
      if (result.kind === "lack") {
        // NOTE save
        lines.push(line)
      } else if (result.kind === "balance") {
        // NOTE commit
        console.log(text)
        lines = []
      } else {
        // NOTE report error
        const report = pt.report(result.token.span, text)
        console.error()
        console.error(`Parentheses error: ${result.kind}`)
        console.error(report)
        lines = []
      }

      {
        const depth = pt.lexers.common.parens_depth(lines.join("\n"))
        rl.setPrompt(createPrompt(depth))
        rl.prompt()
      }
    })
  }
}

function createPrompt(depth: number): string {
  if (depth === 0) {
    return "> "
  } else {
    return "." + "..".repeat(depth) + " "
  }
}
