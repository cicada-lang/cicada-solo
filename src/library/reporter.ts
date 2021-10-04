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
    opts: { path: string; text: string }
  ): Promise<string> {
    const { path, text } = opts

    if (error instanceof Errors.ExpTrace) {
      return error.report({ text })
    } else if (error instanceof pt.ParsingError) {
      return [
        `I found syntax error in file: ${path}`,
        ``,
        pt.report(error.span, text),
        error.concise_message,
      ].join("\n")
    } else {
      throw error
    }
  }
}
