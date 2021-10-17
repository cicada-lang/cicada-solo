import { Book } from "../book"
import { Runner } from "../runner"

export class DefaultRunner extends Runner {
  book: Book

  constructor(opts: { book: Book }) {
    super()
    this.book = opts.book
  }

  async run(path: string): Promise<{ error?: unknown }> {
    try {
      const text = await this.book.files.getOrFail(path)
      const mod = this.book.load(path, text)
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
