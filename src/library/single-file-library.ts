import { Library, LibraryConfig } from "../library"
import { Module } from "../module"
import { CicDoc } from "../doc"
import * as Syntax from "../syntax"
import fs from "fs"

export class SingleFileLibrary extends Library {
  config: LibraryConfig
  path: string

  constructor(path: string) {
    super()
    this.path = path
    this.config = new LibraryConfig({
      name: "single-file-library",
      date: new Date().toLocaleDateString(),
    })
  }

  async fetch_doc(path: string): Promise<CicDoc> {
    const text = fs.readFileSync(this.path, { encoding: "utf-8" })
    return new CicDoc({ library: this, text })
  }

  async fetch_docs(): Promise<Record<string, CicDoc>> {
    const text = fs.readFileSync(this.path, { encoding: "utf-8" })
    const doc = new CicDoc({ library: this, text })
    return { [this.path]: doc }
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

    const doc = await this.fetch_doc(this.path)
    const mod = await Module.from_doc(doc)

    if (mod.output) {
      console.log(mod.output)
    }

    return mod
  }

  async load_mods(): Promise<Map<string, Module>> {
    return new Map([[this.path, await this.load(this.path)]])
  }
}
