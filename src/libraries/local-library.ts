import { Library, LibraryConfig } from "../library"
import { Module } from "../module"
import { ModuleLoader } from "../module"
import Path from "path"
import fs from "fs"
import readdirp from "readdirp"
import chalk from "chalk"

export class LocalLibrary extends Library {
  root_dir: string
  config: LibraryConfig
  cached_mods: Map<string, Module>

  constructor(opts: {
    root_dir: string
    config: LibraryConfig
    cached_mods?: Map<string, Module>
  }) {
    super()
    this.root_dir = opts.root_dir
    this.config = opts.config
    this.cached_mods = opts.cached_mods || new Map()
  }

  static async from_config_file<Module>(file: string): Promise<LocalLibrary> {
    const text = await fs.promises.readFile(file, "utf8")
    return new LocalLibrary({
      root_dir: Path.dirname(file),
      config: new LibraryConfig(JSON.parse(text)),
    })
  }

  async fetch_file(path: string): Promise<string> {
    const file = Path.isAbsolute(path)
      ? path
      : Path.resolve(this.root_dir, this.config.src, path)
    return await fs.promises.readFile(file, "utf8")
  }

  async list_paths(): Promise<Array<string>> {
    const src_dir = Path.resolve(this.root_dir, this.config.src)
    const entries = await readdirp.promise(src_dir)
    return entries.map(({ path }) => path)
  }

  async load(path: string): Promise<Module> {
    const cached = this.cached_mods.get(path)
    if (cached) {
      return cached
    }

    const t0 = Date.now()
    const mod = await ModuleLoader.load(this, path)
    await mod.execute()
    const t1 = Date.now()

    this.cached_mods.set(path, mod)
    return mod
  }

  async reload(path: string): Promise<Module> {
    this.cached_mods.delete(path)
    return await this.load(path)
  }

  async load_mods(): Promise<Map<string, Module>> {
    const files = await this.fetch_files()
    for (const path of Object.keys(files)) {
      await this.load(path)
    }

    return this.cached_mods
  }
}
