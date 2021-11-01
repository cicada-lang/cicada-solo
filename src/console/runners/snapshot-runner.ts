import { Runner } from "../runner"
import { Book } from "../../book"
import { LocalFileStore } from "@enchanterjs/enchanter/lib/file-stores/local-file-store"
import { CtxOptions } from "../../lang/ctx"
import * as ut from "../../ut"
import fs from "fs"

export class SnapshotRunner extends Runner {
  static extensions = [".cic", ".md"]

  book: Book<LocalFileStore>

  constructor(opts: { book: Book<LocalFileStore> }) {
    super()
    this.book = opts.book
  }

  async run(path: string, opts: CtxOptions): Promise<{ error?: unknown }> {
    try {
      const mod = this.book.load(
        path,
        await this.book.files.getOrFail(path),
        opts
      )
      await mod.runAll()
      const file = this.book.files.resolve(path + ".out")
      const output = mod.codeBlocks.allOutputs
        .map((output) => output.formatForConsole())
        .join("\n")
      if (output) {
        await fs.promises.writeFile(file, ut.stripAnsi(output))
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
