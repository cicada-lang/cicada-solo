import Path from "path"
import { Book } from "../../book"
import { CtxOptions } from "../../lang/ctx"
import { Runner } from "../runner"

export class CommonRunner extends Runner {
  async run(
    book: Book,
    path: string,
    opts: CtxOptions
  ): Promise<{ error?: unknown }> {
    try {
      const file = await book.files.getOrFail(path)
      const url = new URL(`file:${path}`)
      const mod = book.load(url, file, opts)
      await mod.runAll()
      const output = mod.codeBlocks.allOutputs
        .map((output) => output.formatForConsole())
        .join("\n")

      if (output) {
        console.log(output)
      }

      return { error: undefined }
    } catch (error) {
      const text = await book.files.getOrFail(path)
      const report = this.reporter.report(error, {
        path: Path.relative(process.cwd(), path),
        text,
      })
      console.error(report)
      return { error }
    }
  }
}
