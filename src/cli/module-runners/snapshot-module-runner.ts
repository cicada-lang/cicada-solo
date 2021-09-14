import { Library } from "../../library"
import { LocalFileAdapter } from "../../library/file-adapters"
import { ModuleLogger } from "../module-logger"
import { ModuleRunner } from "../module-runner"
import { Module } from "../../module"
import Path from "path"
import fs from "fs"

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
      await this.snapshot(path, mod)
      this.logger.info(opts.by, path)
      return { error: undefined }
    } catch (error) {
      await this.logger.error(error as any, path)
      this.logger.error(opts.by, path)
      return { error }
    }
  }

  private async snapshot(path: string, mod: Module): Promise<void> {
    const file = Path.resolve(
      this.files.root_dir,
      this.files.config.src,
      path + ".out"
    )

    await fs.promises.writeFile(file, mod.output)
  }
}
