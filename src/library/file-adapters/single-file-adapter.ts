import { FileAdapter } from "../file-adapter"
import { LibraryConfig } from "../../library"
import { Module } from "../../module"
import { ModuleLoader } from "../../module"
import fs from "fs"

export class SingleFileAdapter extends FileAdapter {
  config: LibraryConfig
  path: string

  constructor(opts: { path: string }) {
    super()
    this.path = opts.path
    this.config = LibraryConfig.create({
      name: "single-file-library",
      date: new Date().toLocaleDateString(),
    })
  }

  async list(): Promise<Array<string>> {
    return [this.path]
  }

  async get(path: string): Promise<string> {
    return fs.readFileSync(this.path, { encoding: "utf-8" })
  }
}
