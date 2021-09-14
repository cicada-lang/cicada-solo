import { LocalFileAdapter } from "./local-file-adapter"
import { LibraryConfig } from "../../library"
import { Module } from "../../module"
import { ModuleLoader } from "../../module"
import fs from "fs"
import Path from "path"

export class SingleFileAdapter extends LocalFileAdapter {
  config: LibraryConfig
  path: string

  constructor(opts: { path: string }) {
    const path = Path.resolve(opts.path)
    const dir = Path.dirname(path)
    const config = LibraryConfig.create({
      name: "single-file-library",
      date: new Date().toLocaleDateString(),
    })

    super({ root_dir: dir, config })

    this.path = path
    this.config = config
  }

  async list(): Promise<Array<string>> {
    return [this.path]
  }

  async get(path: string): Promise<string> {
    if (path !== this.path) {
      throw new Error(
        `I only have a single file: ${this.path}, given path: ${path}`
      )
    }

    return fs.readFileSync(this.path, { encoding: "utf-8" })
  }
}
