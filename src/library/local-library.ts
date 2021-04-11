import { Library, LibraryConfig } from "../library"
import { Module } from "../module"
import * as Syntax from "../syntax"
import Path from "path"
import fs from "fs"
import readdirp from "readdirp"

export class LocalLibrary implements Library {
  root_dir: string
  config: LibraryConfig
  cached_modules: Map<string, Module>

  constructor(opts: {
    root_dir: string
    config: LibraryConfig
    cached_modules?: Map<string, Module>
  }) {
    this.root_dir = opts.root_dir
    this.config = opts.config
    this.cached_modules = opts.cached_modules || new Map()
  }

  static async from_config_file(file: string): Promise<LocalLibrary> {
    const text = await fs.promises.readFile(file, "utf8")
    return new LocalLibrary({
      root_dir: Path.dirname(file),
      config: new LibraryConfig(JSON.parse(text)),
    })
  }

  async load(path: string, opts?: { silent?: boolean }): Promise<Module> {
    const cached = this.cached_modules.get(path)
    if (cached) {
      return cached
    }

    const file = Path.resolve(this.root_dir, this.config.src, path)
    const text = await fs.promises.readFile(file, "utf8")
    const stmts = Syntax.parse_stmts(text)
    let mod = new Module({ library: this })
    for (const stmt of stmts) await stmt.execute(mod)
    if (!opts?.silent && mod.output) console.log(mod.output)
    this.cached_modules.set(path, mod)
    return mod
  }

  async load_all(): Promise<Map<string, Module>> {
    const src_dir = Path.resolve(this.root_dir, this.config.src)
    for await (const { path } of readdirp(src_dir)) {
      await this.load(path, { silent: true })
    }
    return this.cached_modules
  }
}
