import { ReplEvent, ReplEventHandler } from "../infra/repl"
import { Library } from "../library"
import { ErrorReporter } from "../error-reporter"
import * as StmtOutputs from "../stmt-outputs"
import * as ut from "../ut"
import { AppConfig } from "./app-config"

export class AppReplEventHandler extends ReplEventHandler {
  config = new AppConfig()
  library: Library
  path: string

  constructor(opts: { library: Library; path: string }) {
    super()
    this.path = opts.path
    this.library = opts.library
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
    const mod = await this.library.load(this.path)

    try {
      const outputs = await mod.append(text).run()
      for (const output of outputs) {
        if (output instanceof StmtOutputs.NormalTerm) {
          const exp = output.exp.repr()
          const t = output.t.repr()
          console.log(`${ut.colors.yellow(exp)}: ${ut.colors.blue(t)}`)
        } else {
          console.log(output.repr().trim())
        }
      }
      return true
    } catch (error) {
      mod.undo(mod.index)

      const reporter = new ErrorReporter()
      const report = reporter.report(error, { text })
      if (report.trim()) {
        console.error(report.trim())
      }
      return false
    }
  }
}
