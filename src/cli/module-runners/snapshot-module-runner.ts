import { Library } from "../../library"
import { LocalFileAdapter } from "../../library/file-adapters"
import { ModuleLogger } from "../module-logger"
import { ModuleRunner } from "../module-runner"

export class SnapshotModuleRunner extends ModuleRunner {
  static extensions = [".snapshot.cic", ".snapshot.md"]

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
      await this.logger.snapshot(path, mod)
      this.logger.maybe_assert_error(path)
      this.logger.log_info(opts.by, path)
      return { error: undefined }
    } catch (error) {
      await this.logger.error(error as any, path)
      this.logger.log_error(opts.by, path)
      return { error }
    }
  }
}
