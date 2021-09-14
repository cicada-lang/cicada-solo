import { Library, LibraryConfig } from "../library"
import { FileAdapter } from "../library/file-adapter"
import { SingleFileAdapter } from "../library/file-adapters"
import { Module } from "../module"
import { ModuleLoader } from "../module"
import fs from "fs"

export class SingleFileLibrary extends Library {
  config: LibraryConfig
  path: string
  files: SingleFileAdapter

  constructor(opts: { path: string }) {
    super()
    this.path = opts.path
    this.config = LibraryConfig.create({
      name: "single-file-library",
      date: new Date().toLocaleDateString(),
    })

    this.files = new SingleFileAdapter(opts)
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
