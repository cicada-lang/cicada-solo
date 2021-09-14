import { Library } from "../../library"
import { LocalFileAdapter } from "../../library/file-adapters"
import { ModuleLogger } from "../module-logger"
import { ModuleRunner } from "../module-runner"

export class DefaultModuleRunner {
  library: Library
  files: LocalFileAdapter
  logger: ModuleLogger

  constructor(opts: { library: Library; files: LocalFileAdapter }) {
    this.library = opts.library
    this.files = opts.files
    this.logger = new ModuleLogger({ files: opts.files })
  }

  async run(path: string, opts: { by: string }): Promise<boolean> {
    try {
      const mod = await this.library.mods.load(path)
      this.logger.log_info(opts.by, path)
      return false
    } catch (error) {
      // const report = await this.logger.error_report(error, path)
      const error_occurred = await this.logger.error(error as any, path)
      this.logger.log_error(opts.by, path)
      return error_occurred
    }
  }
}
