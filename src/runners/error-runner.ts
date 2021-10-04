import { Library } from "../library"
import { FileStore } from "../infra/file-store"
import { Runner } from "../runner"
import fs from "fs"

export class ErrorRunner extends Runner {
  static extensions = [".error.cic", ".error.md"]

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
      return { error: new Error(`I expect to find error in the path: ${path}`) }
    } catch (error) {
      const report = await this.library.reporter.error(error, {
        path,
        text: await this.files.getOrFail(path),
      })
      const file = this.files.resolve(path + ".out")
      await fs.promises.writeFile(file, report)
      return { error: undefined }
    }
  }
}
