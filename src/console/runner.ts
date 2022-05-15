import fs from "fs"
import { StmtOutput } from "src/lang/stmt"
import { ModLoader } from "../lang/mod"

export class Runner {
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
      if (!opts?.silent) {
        if (error instanceof Error) {
          console.error(error.message)
        } else {
          console.error(error)
        }
      }

      return { error }
    }
  }
}
