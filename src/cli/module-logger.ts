import { LocalFileAdapter } from "../library/file-adapters"
import { Module } from "../module"
import { Trace } from "../errors"
import pt from "@cicada-lang/partech"
import moment from "moment"
import chalk from "chalk"
import Path from "path"
import fs from "fs"

export class ModuleLogger {
  files: LocalFileAdapter

  constructor(opts: { files: LocalFileAdapter }) {
    this.files = opts.files
  }

  log_info(tag: string, path: string): void {
    console.log(
      chalk.bold(`(${tag})`),
      chalk.green.bold(`[${moment().format("HH:MM:SS")}]`),
      path
    )
  }

  log_error(tag: string, path: string): void {
    console.log(
      chalk.bold(`(${tag})`),
      chalk.red.bold(`[${moment().format("HH:MM:SS")}]`),
      path
    )
  }

  async snapshot(path: string, mod: Module): Promise<void> {
    if (path.endsWith(".snapshot.cic") || path.endsWith(".snapshot.md")) {
      const file = Path.resolve(
        this.files.root_dir,
        this.files.config.src,
        path + ".out"
      )

      await fs.promises.writeFile(file, mod.output)
    }
  }

  async error(error: Error, path: string): Promise<boolean> {
    const report = await this.error_report(error, path)

    if (path.endsWith(".error.cic") || path.endsWith(".error.md")) {
      const file = Path.resolve(
        this.files.root_dir,
        this.files.config.src,
        path + ".out"
      )

      await fs.promises.writeFile(file, report)

      return false
    }

    console.error(report)

    return true
  }

  maybe_assert_error(path: string): void {
    if (path.endsWith(".error.cic") || path.endsWith(".error.md")) {
      throw new Error(`I expect to find error in the file: ${path}`)
    }
  }

  private async error_report(error: Error, path: string): Promise<string> {
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
