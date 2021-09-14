import { Library } from "../../library"
import { LocalFileAdapter } from "../../library/file-adapters"
import { Logger } from "../logger"
import { ModuleRunner } from "../module-runner"
import { error_report } from "../error-report"

export class DefaultModuleRunner extends ModuleRunner {
  library: Library
  files: LocalFileAdapter
  logger: Logger

  constructor(opts: { library: Library; files: LocalFileAdapter }) {
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
      const report = await error_report(error, path, this.files)
      console.error(report)
      this.logger.error(opts.by, path)
      return { error }
    }
  }
}
