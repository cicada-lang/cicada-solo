import { Library } from "../../library"
import { LocalFileAdapter } from "../../library/file-adapters"
import { Logger } from "../logger"
import { ModuleRunner } from "../module-runner"
import fs from "fs"

export class SnapshotModuleRunner extends ModuleRunner {
  static extensions = [".snapshot.cic", ".snapshot.md"]

  library: Library
  files: LocalFileAdapter
  logger?: Logger

  constructor(opts: {
    library: Library
    files: LocalFileAdapter
    logger?: Logger
  }) {
    super()
    this.library = opts.library
    this.files = opts.files
    this.logger = opts.logger
  }

  async run(path: string): Promise<{ error?: unknown }> {
    try {
      const mod = await this.library.mods.load(path)
      const file = this.files.src(path + ".out")
      await fs.promises.writeFile(file, mod.output)
      if (this.logger) {
        this.logger.info(path)
      }
      return { error: undefined }
    } catch (error) {
      const report = await this.library.error_report(error, path)
      console.error(report)
      if (this.logger) {
        this.logger.error(path)
      }
      return { error }
    }
  }
}
