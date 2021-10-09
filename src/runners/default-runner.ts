import { Book } from "../book"
import { ErrorReporter } from "../error-reporter"
import { Runner } from "../runner"

export class DefaultRunner extends Runner {
  library: Book

  constructor(opts: { library: Book }) {
    super()
    this.library = opts.library
  }

  async run(path: string): Promise<{ error?: unknown }> {
    try {
      const mod = await this.library.load(path)
      await mod.run()
      if (mod.all_output) {
        console.log(mod.all_output)
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
