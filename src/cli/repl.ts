import Readline from "readline"
import pt from "@cicada-lang/partech"
const pkg = require("../../package.json")

export class Repl {
  run(): void {
    const rl = Readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    let lines: Array<string> = []

    console.log(`Welcome to Cicada ${pkg.version} ^-^/`)

    rl.prompt()
    rl.on("line", (line) => {
      lines.push(line)
      const text = lines.join("\n") + "\n"
      const result = pt.lexers.common.check_parentheses(text)
      console.log(result)
      // TODO
      rl.prompt()
    })
  }
}
