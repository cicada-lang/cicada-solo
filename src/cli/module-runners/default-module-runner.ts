import { Library } from "../../library"
import { FileAdapter } from "../../library/file-adapter"
import { Logger } from "../logger"
import { ModuleRunner } from "../module-runner"

export class DefaultModuleRunner extends ModuleRunner {
  library: Library
  files: FileAdapter
  logger: Logger

  constructor(opts: { library: Library; files: FileAdapter }) {
    super()
    this.library = opts.library
    this.files = opts.files
    this.logger = new Logger()
  }

  async run(path: string, opts: { by: string }): Promise<{ error?: unknown }> {
    try {
      const mod = await this.library.mods.load(path)
      this.logger.info(opts.by, path)
      return { error: undefined }
    } catch (error) {
      const report = await this.library.error_report(error, path)
      console.error(report)
      this.logger.error(opts.by, path)
      return { error }
    }
  }
}
