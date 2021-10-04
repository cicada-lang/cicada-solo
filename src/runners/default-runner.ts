import { Library } from "../library"
import { FileStore } from "../infra/file-store"
import { Runner } from "../runner"

export class DefaultRunner extends Runner {
  library: Library

  constructor(opts: { library: Library }) {
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
      const report = await this.library.reporter.error(error, {
        path,
        text: await this.library.files.getOrFail(path),
      })
      console.error(report)
      return { error }
    }
  }
}
