import { FileResource } from "./file-resource"
import { Trace } from "../errors"
import pt from "@cicada-lang/partech"

export class Reporter {
  files: FileResource

  constructor(opts: { files: FileResource }) {
    this.files = opts.files
  }

  async error(error: unknown, path: string): Promise<string> {
    if (error instanceof Trace) {
      return error.repr((exp) => exp.repr())
    } else if (error instanceof pt.ParsingError) {
      const text = await this.files.get(path)
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