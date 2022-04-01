import Path from "path"
import * as Errors from "../lang/errors"
import { Mod } from "../lang/mod"
import { readURL } from "../ut/node/url"

let lastMod: any = null

export class Runner {
  reporter = new Errors.ErrorReporter()

  async run(
    url: URL,
    opts?: { silent?: boolean }
  ): Promise<{ error?: unknown }> {
    try {
      const mod = await Mod.load(url, {
        fileFetcher: { fetch: readURL },
      })

      await mod.runAll()

      const output = mod.blocks.allOutputs
        .map((output) => output.formatForConsole())
        .join("\n")

      if (output && !opts?.silent) {
        console.log(output)
      }

      return { error: undefined }
    } catch (error) {
      const path = Path.relative(process.cwd(), url.pathname)
      const text = await readURL(url)
      const report = this.reporter.report(error, { path, text })

      if (!opts?.silent) {
        console.error(report)
      }

      return { error }
    }
  }
}
