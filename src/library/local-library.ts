import { Library, LibraryConfig } from "../library"
import { Module } from "../module"
import * as Syntax from "../syntax"
import Path from "path"
import fs from "fs"

export class LocalLibrary implements Library {
  base_dir: string
  config: LibraryConfig
  cached_modules: Map<string, Module>

  constructor(opts: {
    base_dir: string
    config: LibraryConfig
    cached_modules?: Map<string, Module>
  }) {
    this.base_dir = opts.base_dir
    this.config = opts.config
    this.cached_modules = opts.cached_modules || new Map()
  }

  static async from_config_file(file: string): Promise<LocalLibrary> {
    const text = await fs.promises.readFile(file, "utf8")
    return new LocalLibrary({
      base_dir: Path.dirname(file),
      config: new LibraryConfig(JSON.parse(text)),
    })
  }

  async load(name: string): Promise<Module> {
    const cached = this.cached_modules.get(name)
    if (cached) return cached

    const file = Path.resolve(this.base_dir, this.config.src, name)
    const text = await fs.promises.readFile(file, "utf8")
    const stmts = Syntax.parse_stmts(text)
    let mod = new Module({ library: this })
    for (const stmt of stmts) await stmt.execute(mod)
    if (mod.output) {
      console.log(mod.output)
    }
    this.cached_modules.set(name, mod)
    return mod
  }
}
