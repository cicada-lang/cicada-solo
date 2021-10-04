import { Library } from "../library"
import { Runner } from "../runner"
import fs from "fs"

export class ErrorRunner extends Runner {
  static extensions = [".error.cic", ".error.md"]

  library: Library

  constructor(opts: { library: Library }) {
    super()
    this.library = opts.library
  }

  async run(path: string): Promise<{ error?: unknown }> {
    try {
      const mod = await this.library.load(path)
      await mod.run()
      return { error: new Error(`I expect to find error in the path: ${path}`) }
    } catch (error) {
      const text = await this.library.files.getOrFail(path)
      const report = this.reporter.report(error, { path, text })
      const file = this.library.files.resolve(path + ".out")
      await fs.promises.writeFile(file, report)
      return { error: undefined }
    }
  }
}
