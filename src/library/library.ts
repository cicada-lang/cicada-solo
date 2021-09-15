import { LibraryConfig } from "../library"
import { Module } from "../module"
import { ModuleLoader } from "../module"
import { FileResource } from "./file-resource"
import { ModuleManager } from "./module-manager"

import { Trace } from "../errors"
import pt from "@cicada-lang/partech"
import moment from "moment"
import chalk from "chalk"

export class Library {
  files: FileResource

  constructor(opts: { files: FileResource }) {
    this.files = opts.files
  }

  get mods(): ModuleManager {
    return new ModuleManager({ library: this })
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
