import { Trace } from "../errors"
import pt from "@cicada-lang/partech"
import moment from "moment"
import chalk from "chalk"
import { LocalFileAdapter } from "../library/file-adapters"

export async function error_report(
  error: unknown,
  path: string,
  files: LocalFileAdapter
): Promise<string> {
  if (error instanceof Trace) {
    return error.repr((exp) => exp.repr())
  } else if (error instanceof pt.ParsingError) {
    const text = await files.get(path)
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
