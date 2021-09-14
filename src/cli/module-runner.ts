import { Library } from "../library"
import { LocalFileAdapter } from "../library/file-adapters"
import { ModuleLogger } from "./module-logger"

export class ModuleRunner {
  library: Library
  files: LocalFileAdapter
  logger: ModuleLogger

  constructor(opts: { library: Library; files: LocalFileAdapter }) {
    this.library = opts.library
    this.files = opts.files
    this.logger = new ModuleLogger({ files: opts.files })
  }

  async run(path: string): Promise<boolean> {
    try {
      const mod = await this.library.mods.load(path)
      await this.logger.snapshot(path, mod)
      this.logger.maybe_assert_error(path)
      this.logger.log_info("check", path)
      return false
    } catch (error) {
      const error_occurred = await this.logger.error(error as any, path)
      this.logger.log_error("check", path)
      return error_occurred
    }
  }

  async rerun(event: string, path: string): Promise<void> {
    try {
      const mod = await this.library.mods.reload(path)
      await this.logger.snapshot(path, mod)
      this.logger.maybe_assert_error(path)
      this.logger.log_info("check", path)
    } catch (error) {
      await this.logger.error(error as any, path)
      this.logger.log_error("check", path)
    }
  }
}
