import { Runner } from "../runner"
import { Book } from "../../book"
import { CtxObserver } from "../../lang/ctx"

export class DefaultRunner extends Runner {
  book: Book

  constructor(opts: { book: Book }) {
    super()
    this.book = opts.book
  }

  async run(
    path: string,
    opts: { observers: Array<CtxObserver> }
  ): Promise<{ error?: unknown }> {
    try {
      const mod = this.book.load(
        path,
        await this.book.files.getOrFail(path),
        opts
      )
      await mod.run_to_the_end()
      if (mod.all_output) {
        console.log(mod.all_output)
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
