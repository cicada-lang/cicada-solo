import fs from "fs"
import { Config } from "../config"
import { ReplEvent, ReplEventHandler } from "../infra/repl"
import * as Errors from "../lang/errors"
import { ModLoader } from "../lang/mod"
import * as StmtOutputs from "../lang/stmt/stmt-outputs"
import * as ut from "../ut"

export class AppReplEventHandler extends ReplEventHandler {
  loader = new ModLoader()
  config: Config

  constructor(opts: { config: Config }) {
    super()
    this.config = opts.config
    this.loader.fetcher.register("file", (url) =>
      fs.promises.readFile(url.pathname, "utf8")
    )
    this.loader.fetcher.register("repl", (url) => "")
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
    const mod = await this.loader.load(url)

    try {
      const block = mod.blocks.create("cicada")
      block.update(text)
      await mod.execute()
      const outputs = mod.blocks.last().outputs
      for (const output of outputs) {
        if (output instanceof StmtOutputs.NormalTerm) {
          const exp = output.exp.format()
          const t = output.t.format()
          console.log(`${ut.colors.yellow(exp)}: ${ut.colors.blue(t)}`)
        } else {
          if (output) console.log(output.format().trim())
        }
      }
      return true
    } catch (error) {
      if (!(error instanceof Errors.LangError)) throw error
      console.error(error.message)
      return false
    }
  }
}
