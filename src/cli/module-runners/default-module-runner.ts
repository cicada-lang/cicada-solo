import { Library } from "../../library"
import { FileAdapter } from "../../library/file-adapter"
import { Logger, LoggerOptions } from "../logger"
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

  async run(
    path: string,
    opts?: { logger?: LoggerOptions }
  ): Promise<{ error?: unknown }> {
    try {
      const mod = await this.library.mods.load(path)
      if (opts?.logger) {
        this.logger.info(path, opts?.logger)
      }
      return { error: undefined }
    } catch (error) {
      const report = await this.library.error_report(error, path)
      console.error(report)
      this.logger.error(path, opts?.logger)
      return { error }
    }
  }
}
