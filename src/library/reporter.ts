import { FileStore } from "../file-store"
import { Trace } from "../errors"
import pt from "@cicada-lang/partech"

export class Reporter {
  files: FileStore

  constructor(opts: { files: FileStore }) {
    this.files = opts.files
  }

  async error(
    error: unknown,
    path: string,
    opts?: { text?: string }
  ): Promise<string> {
    if (error instanceof Trace) {
      return error.repr((exp) => exp.repr())
    } else if (error instanceof pt.ParsingError) {
      const text = opts?.text || (await this.files.getOrFail(path))
      if (!text) {
        return `Unknown path: ${path}`
      } else {
        let message = error.message
        message += "\n"
        message += pt.report(error.span, text)
        return message
      }
    } else {
      throw error
    }
  }
}
