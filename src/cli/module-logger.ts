import { LocalFileAdapter } from "../library/file-adapters"
import { Trace } from "../errors"
import pt from "@cicada-lang/partech"
import moment from "moment"
import chalk from "chalk"

export class ModuleLogger {
  files: LocalFileAdapter

  constructor(opts: { files: LocalFileAdapter }) {
    this.files = opts.files
  }

  info(tag: string, path: string): void {
    console.log(
      chalk.bold(`(${tag})`),
      chalk.green.bold(`[${moment().format("HH:MM:SS")}]`),
      path
    )
  }

  error(tag: string, path: string): void {
    console.log(
      chalk.bold(`(${tag})`),
      chalk.red.bold(`[${moment().format("HH:MM:SS")}]`),
      path
    )
  }

  async error_report(error: unknown, path: string): Promise<string> {
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
