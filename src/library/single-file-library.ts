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

  async load(name: string): Promise<Module> {
    if (name !== this.path) {
      throw new Error(
        `The single file library can not load module: ${name}\n` +
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

  async paths(): Promise<Array<string>> {
    return [this.path]
  }

  async load_all(): Promise<Map<string, Module>> {
    return new Map([[this.path, await this.load(this.path)]])
  }
}
