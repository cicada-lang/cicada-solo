import { Library } from "../library"
import { FileStore } from "../infra/file-store"
import { Logger } from "../logger"
import { Runner } from "../runner"

export class DefaultRunner extends Runner {
  library: Library
  files: FileStore
  logger?: Logger

  constructor(opts: { library: Library; logger?: Logger }) {
    super()
    this.library = opts.library
    this.files = opts.library.files
    this.logger = opts.logger
  }

  async run(path: string): Promise<{ error?: unknown }> {
    try {
      const mod = await this.library.load(path)
      await mod.run()
      if (this.logger) {
        this.logger.info({ msg: path })
      }
      if (mod.all_output) {
        console.log(mod.all_output)
      }
      return { error: undefined }
    } catch (error) {
      const report = await this.library.reporter.error(error, path)
      console.error(report)
      if (this.logger) {
        this.logger.error({ msg: path })
      }
      return { error }
    }
  }
}
