import fs from "fs"
import Path from "path"
import { StmtOutput } from "src/lang/stmt"
import * as Errors from "../lang/errors"
import { ModLoader } from "../lang/mod"

export class Runner {
  reporter = new Errors.ErrorReporter()
  loader = new ModLoader()

  constructor() {
    this.loader.fetcher.register("file", (url) =>
      fs.promises.readFile(url.pathname, "utf8")
    )
  }

  async run(
    url: URL,
    opts?: { silent?: boolean }
  ): Promise<{ error?: unknown }> {
    try {
      const mod = await this.loader.loadAndExecute(url)

      const output = mod.blocks.outputs
        .filter((output) => output !== undefined)
        .map((output) => (output as StmtOutput).formatForConsole())
        .join("\n")

      if (output && !opts?.silent) {
        console.log(output)
      }

      return { error: undefined }
    } catch (error) {
      const path = Path.relative(process.cwd(), url.pathname)
      const text = await this.loader.fetcher.fetch(url)
      const report = this.reporter.report(error, { path, text })

      if (!opts?.silent) {
        console.error(report)
      }

      return { error }
    }
  }
}
