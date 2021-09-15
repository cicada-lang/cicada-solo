import { Library } from "../../library"
import { LocalFileResource } from "../../library/file-resources"
import { Logger } from "../logger"
import { Runner } from "../runner"
import fs from "fs"

export class SnapshotRunner extends Runner {
  static extensions = [".cic", ".md"]

  library: Library
  files: LocalFileResource
  logger?: Logger

  constructor(opts: {
    library: Library
    files: LocalFileResource
    logger?: Logger
  }) {
    super()
    this.library = opts.library
    this.files = opts.files
    this.logger = opts.logger
  }

  async run(path: string): Promise<{ error?: unknown }> {
    try {
      const mod = await this.library.load(path)
      const file = this.files.src(path + ".out")
      if (mod.all_output) {
        await fs.promises.writeFile(file, mod.all_output)
      }
      if (this.logger) {
        this.logger.info(path)
      }
      return { error: undefined }
    } catch (error) {
      const report = await this.library.reporter.error(error, path)
      console.error(report)
      if (this.logger) {
        this.logger.error(path)
      }
      return { error }
    }
  }
}
