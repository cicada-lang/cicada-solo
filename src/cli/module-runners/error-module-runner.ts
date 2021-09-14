import { Library } from "../../library"
import { LocalFileAdapter } from "../../library/file-adapters"
import { Logger, LoggerOptions } from "../logger"
import { ModuleRunner } from "../module-runner"
import Path from "path"
import fs from "fs"

export class ErrorModuleRunner extends ModuleRunner {
  static extensions = [".error.cic", ".error.md"]

  library: Library
  files: LocalFileAdapter
  logger: Logger

  constructor(opts: { library: Library; files: LocalFileAdapter }) {
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
      this.logger.info(path, opts?.logger)
      return { error: new Error(`I expect to find error in the path: ${path}`) }
    } catch (error) {
      const report = await this.library.error_report(error, path)
      const file = this.files.src(path + ".out")
      await fs.promises.writeFile(file, report)
      this.logger.error(path, opts?.logger)
      return { error: undefined }
    }
  }
}
