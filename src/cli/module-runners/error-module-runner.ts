import { Library } from "../../library"
import { LocalFileAdapter } from "../../library/file-adapters"
import { ModuleLogger } from "../module-logger"
import { ModuleRunner } from "../module-runner"
import Path from "path"
import fs from "fs"

export class ErrorModuleRunner extends ModuleRunner {
  static extensions = [".error.cic", ".error.md"]

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
      this.logger.info(opts.by, path)
      return { error: new Error(`I expect to find error in the path: ${path}`) }
    } catch (error) {
      await this.error(error as any, path)
      this.logger.error(opts.by, path)
      return { error: undefined }
    }
  }

  private async error(error: Error, path: string): Promise<void> {
    const report = await this.logger.error_report(error, path)
    const file = Path.resolve(
      this.files.root_dir,
      this.files.config.src,
      path + ".out"
    )
    await fs.promises.writeFile(file, report)
  }
}
