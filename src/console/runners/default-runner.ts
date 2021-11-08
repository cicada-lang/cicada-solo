import { Runner } from "../runner"
import { Book } from "../../book"
import { CtxOptions } from "../../lang/ctx"

export class DefaultRunner extends Runner {
  book: Book

  constructor(opts: { book: Book }) {
    super()
    this.book = opts.book
  }

  async run(path: string, opts: CtxOptions): Promise<{ error?: unknown }> {
    try {
      const file = await this.book.files.getOrFail(path)
      const mod = this.book.load(path, file, opts)
      await mod.runAll()
      const output = mod.codeBlocks.allOutputs
        .map((output) => output.formatForConsole())
        .join("\n")

      if (output) {
        console.log(output)
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
