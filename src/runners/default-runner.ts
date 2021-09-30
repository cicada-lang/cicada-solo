import { Library } from "../library"
import { FileStore } from "../file-store"
import { Logger } from "../runner/logger"
import { Runner } from "../runner"

export class DefaultRunner extends Runner {
  library: Library
  files: FileStore
  logger?: Logger

  constructor(opts: { library: Library; files: FileStore; logger?: Logger }) {
    super()
    this.library = opts.library
    this.files = opts.files
    this.logger = opts.logger
  }

  async run(path: string): Promise<{ error?: unknown }> {
    try {
      const mod = await this.library.load(path)
      await mod.run()
      if (this.logger) {
        this.logger.info(path)
      }
      if (mod.all_output) {
        console.log(mod.all_output)
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
