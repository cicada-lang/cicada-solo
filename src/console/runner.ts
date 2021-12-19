import Path from "path"
import { CtxOptions } from "../lang/ctx"
import * as Errors from "../lang/errors"
import { Module } from "../module"
import * as ut from "../ut"

export class Runner {
  reporter = new Errors.ErrorReporter()

  async run(
    url: URL,
    opts: CtxOptions & { silent?: boolean }
  ): Promise<{ error?: unknown }> {
    try {
      const mod = await Module.load(url, opts)
      await mod.runAll()
      const output = mod.codeBlocks.allOutputs
        .map((output) => output.formatForConsole())
        .join("\n")

      if (output && !opts.silent) {
        console.log(output)
      }

      return { error: undefined }
    } catch (error) {
      const path = Path.relative(process.cwd(), url.pathname)
      const text = await ut.readURL(url)
      const report = this.reporter.report(error, { path, text })

      if (!opts.silent) {
        console.error(report)
      }

      return { error }
    }
  }
}
