import { Book } from "../book"
import { LocalFileStore } from "@xieyuheng/enchanter/lib/file-stores"
import { Runner } from "../runner"
import * as ut from "../ut"
import fs from "fs"

export class SnapshotRunner extends Runner {
  static extensions = [".cic", ".md"]

  book: Book<LocalFileStore>

  constructor(opts: { book: Book<LocalFileStore> }) {
    super()
    this.book = opts.book
  }

  async run(path: string): Promise<{ error?: unknown }> {
    try {
      const mod = await this.book.load(path)
      await mod.run()
      const file = this.book.files.resolve(path + ".out")
      if (mod.all_output) {
        await fs.promises.writeFile(file, ut.stripAnsi(mod.all_output))
      }
      return { error: undefined }
    } catch (error) {
      const text = await this.book.files.getOrFail(path)
      const report = this.reporter.report(error, { path, text })
      console.error(report)
      return { error }
    }
  }
}
