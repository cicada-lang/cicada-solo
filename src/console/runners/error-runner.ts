import { LocalFileStore } from "@enchanterjs/enchanter/lib/file-stores/local-file-store"
import fs from "fs"
import { Book } from "../../book"
import { CtxOptions } from "../../lang/ctx"
import * as ut from "../../ut"
import { Runner } from "../runner"

export class ErrorRunner extends Runner {
  static extensions = [".error.cic", ".error.md"]

  async run(
    book: Book<LocalFileStore>,
    path: string,
    opts: CtxOptions
  ): Promise<{ error?: unknown }> {
    try {
      const file = await book.files.getOrFail(path)
      const mod = book.load(path, file, opts)
      await mod.runAll()

      return {
        error: new Error(`I expect to find error in the path: ${path}`),
      }
    } catch (error) {
      const text = await book.files.getOrFail(path)
      const report = this.reporter.report(error, { path, text })
      const file = book.files.resolve(path + ".out")
      await fs.promises.writeFile(file, ut.stripAnsi(report))
      return { error: undefined }
    }
  }
}
