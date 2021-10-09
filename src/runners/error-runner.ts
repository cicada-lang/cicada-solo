import { Book } from "../book"
import { LocalFileStore } from "@xieyuheng/enchanter/lib/file-stores"
import { Runner } from "../runner"
import * as ut from "../ut"
import fs from "fs"

export class ErrorRunner extends Runner {
  static extensions = [".error.cic", ".error.md"]

  library: Book<LocalFileStore>

  constructor(opts: { library: Book<LocalFileStore> }) {
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
      await fs.promises.writeFile(file, ut.stripAnsi(report))
      return { error: undefined }
    }
  }
}
