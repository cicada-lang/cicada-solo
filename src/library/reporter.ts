import { FileStore } from "../infra/file-store"
import * as Errors from "../errors"
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
    if (error instanceof Errors.ExpTrace) {
      return error.repr()
    } else if (error instanceof pt.ParsingError) {
      const text = opts?.text || (await this.files.getOrFail(path))
      if (!text) {
        return [
          `I found syntax error in path: ${path}`,
          ``,
          error.concise_message,
        ].join("\n")
      } else {
        return [
          `I found syntax error in text:`,
          ``,
          pt.report(error.span, text),
          error.concise_message,
        ].join("\n")
      }
    } else {
      throw error
    }
  }
}
