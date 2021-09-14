import { Library, LibraryConfig } from "../library"
import { Module } from "../module"
import { ModuleLoader } from "../module"
import fs from "fs"

export class SingleFileLibrary extends Library {
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

  async reload(path: string): Promise<Module> {
    return await this.load(path)
  }

  async load(path: string): Promise<Module> {
    if (path !== this.path) {
      console.warn(
        `The single file library can not load module: ${path}\n` +
          `The only file in this library is: ${this.path}`
      )
    }

    const mod = await ModuleLoader.load(this, this.path)
    await mod.execute()
    return mod
  }

  async load_mods(): Promise<Map<string, Module>> {
    return new Map([[this.path, await this.load(this.path)]])
  }
}
