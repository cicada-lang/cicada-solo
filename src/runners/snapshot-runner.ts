import { Library } from "../library"
import { Runner } from "../runner"
import fs from "fs"

export class SnapshotRunner extends Runner {
  static extensions = [".cic", ".md"]

  library: Library

  constructor(opts: { library: Library }) {
    super()
    this.library = opts.library
  }

  async run(path: string): Promise<{ error?: unknown }> {
    try {
      const mod = await this.library.load(path)
      await mod.run()
      const file = this.library.files.resolve(path + ".out")
      if (mod.all_output) {
        await fs.promises.writeFile(file, mod.all_output)
      }
      return { error: undefined }
    } catch (error) {
      const text = await this.library.files.getOrFail(path)
      const report = this.reporter.report(error, { path, text })
      console.error(report)
      return { error }
    }
  }
}
