import { Library, LibraryConfig } from "../library"
import { Module } from "../module"
import * as Syntax from "../syntax"
import fs from "fs"

export class SingleFileLibrary implements Library {
  config: LibraryConfig
  path: string

  constructor(path: string) {
    this.path = path
    this.config = new LibraryConfig({
      name: "single-file-library",
      date: new Date().toLocaleDateString(),
    })
  }

  async fetch_files(): Promise<Map<string, string>> {
    const text = fs.readFileSync(this.path, { encoding: "utf-8" })
    return new Map([[this.path, text]])
  }

  async resolve_path(path: string): Promise<string> {
    return this.path
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

    const text = fs.readFileSync(this.path, { encoding: "utf-8" })
    const stmts = Syntax.parse_stmts(text)

    const mod = new Module({ library: this })
    for (const stmt of stmts) {
      await stmt.execute(mod)
    }

    if (mod.output) {
      console.log(mod.output)
    }

    return mod
  }

  async load_mods(): Promise<Map<string, Module>> {
    return new Map([[this.path, await this.load(this.path)]])
  }
}
