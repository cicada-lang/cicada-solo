import { ReplEvent, ReplEventHandler } from "../repl"
import { Library } from "../library"
import * as StmtOutputs from "../stmt-outputs"
import chalk from "chalk"
const pkg = require("../../package.json")

export class CicReplEventHandler extends ReplEventHandler {
  library: Library
  path: string

  constructor(opts: { library: Library; path: string }) {
    super()
    this.path = opts.path
    this.library = opts.library
  }

  greeting(): void {
    console.log(`Welcome to Cicada ${pkg.version} *^-^*/`)
    console.log(`Type ".help" for more information`)
  }

  async handle(event: ReplEvent): Promise<void> {
    const { text } = event
    await this.execute(text)
  }

  private async execute(text: string): Promise<void> {
    const mod = await this.library.load(this.path)

    try {
      const outputs = await mod.append(text).run()
      for (const output of outputs) {
        if (output instanceof StmtOutputs.NormalTerm) {
          const exp = output.exp.repr()
          const t = output.t.repr()
          console.log(`${chalk.yellow(exp)}: ${chalk.blue(t)}`)
        } else {
          console.log(output.repr().trim())
        }
      }
    } catch (error) {
      mod.undo(mod.index)
      const reporter = this.library.reporter
      const report = await reporter.error(error, this.path, { text })
      if (report.trim()) {
        console.error(report.trim())
      }
    }
  }
}
