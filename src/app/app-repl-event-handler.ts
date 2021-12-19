import { ReplEvent, ReplEventHandler } from "@enchanterjs/enchanter/lib/repl"
import { Config } from "../config"
import * as Errors from "../lang/errors"
import * as StmtOutputs from "../lang/stmt/stmt-outputs"
import { Module } from "../module"
import * as ut from "../ut"

export class AppReplEventHandler extends ReplEventHandler {
  config: Config

  constructor(opts: { config: Config }) {
    super()
    this.config = opts.config
  }

  greeting(): void {
    console.log(`Welcome to Cicada ${this.config.pkg.version} *^-^*/`)
    console.log(`Type ".help" for more information`)
  }

  async handle(event: ReplEvent): Promise<boolean> {
    const { text } = event
    return await this.execute(text)
  }

  private async execute(text: string): Promise<boolean> {
    text = text.trim()
    const url = new URL("repl:")

    const mod = await Module.load(url)

    try {
      mod.codeBlocks.appendCode(text)
      const outputs = await mod.runAll()
      for (const output of outputs) {
        if (output instanceof StmtOutputs.NormalTerm) {
          const exp = output.exp.format()
          const t = output.t.format()
          console.log(`${ut.colors.yellow(exp)}: ${ut.colors.blue(t)}`)
        } else {
          console.log(output.format().trim())
        }
      }
      return true
    } catch (error) {
      const reporter = new Errors.ErrorReporter()
      const report = reporter.report(error, { text })
      if (report.trim()) {
        console.error(report.trim())
      }
      return false
    }
  }
}
