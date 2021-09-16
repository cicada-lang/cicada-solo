import { Library } from "../../library"
import { LocalFileResource } from "../../library/file-resources"
import { Logger } from "../logger"
import { Runner } from "../runner"
import fs from "fs"

export class ErrorRunner extends Runner {
  static extensions = [".error.cic", ".error.md"]

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
      if (this.logger) {
        this.logger.info(path)
      }
      return { error: new Error(`I expect to find error in the path: ${path}`) }
    } catch (error) {
      const report = await this.library.reporter.error(error, path)
      const file = this.files.src(path + ".out")
      await fs.promises.writeFile(file, report)
      if (this.logger) {
        this.logger.error(path)
      }
      return { error: undefined }
    }
  }
}