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
        return [
          "I found syntax error in the following text:",
          "",
          pt.report(error.span, text),
          error.concise_message,
        ].join("\n")
      }
    } else {
      throw error
    }
  }
}
