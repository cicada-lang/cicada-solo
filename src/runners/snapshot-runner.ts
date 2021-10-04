import { Library } from "../library"
import { FileStore } from "../infra/file-store"
import { Runner } from "../runner"
import fs from "fs"

export class SnapshotRunner extends Runner {
  static extensions = [".cic", ".md"]

  library: Library
  files: FileStore

  constructor(opts: { library: Library }) {
    super()
    this.library = opts.library
    this.files = opts.library.files
  }

  async run(path: string): Promise<{ error?: unknown }> {
    try {
      const mod = await this.library.load(path)
      await mod.run()
      const file = this.files.resolve(path + ".out")
      if (mod.all_output) {
        await fs.promises.writeFile(file, mod.all_output)
      }
      return { error: undefined }
    } catch (error) {
      const report = await this.library.reporter.error(error, {
        path,
        text: await this.files.getOrFail(path),
      })
      console.error(report)
      return { error }
    }
  }
}
