import { Library } from "../../library"
import { LocalFileAdapter } from "../../library/file-adapters"
import { ModuleLogger } from "../module-logger"
import { ModuleRunner } from "../module-runner"

export class DefaultModuleRunner extends ModuleRunner {
  library: Library
  files: LocalFileAdapter
  logger: ModuleLogger

  constructor(opts: { library: Library; files: LocalFileAdapter }) {
    super()
    this.library = opts.library
    this.files = opts.files
    this.logger = new ModuleLogger({ files: opts.files })
  }

  async run(path: string, opts: { by: string }): Promise<{ error?: unknown }> {
    try {
      const mod = await this.library.mods.load(path)
      this.logger.log_info(opts.by, path)
      return { error: undefined }
    } catch (error) {
      const report = await this.logger.error_report(error, path)
      console.error(report)
      this.logger.log_error(opts.by, path)
      return { error }
    }
  }
}
