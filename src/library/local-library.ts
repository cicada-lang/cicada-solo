import { Library, LibraryConfig } from "../library"
import { Module } from "../module"
import { CicDoc } from "../doc"
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

  static async from_config_file(file: string): Promise<LocalLibrary> {
    const text = await fs.promises.readFile(file, "utf8")
    return new LocalLibrary({
      root_dir: Path.dirname(file),
      config: new LibraryConfig(JSON.parse(text)),
    })
  }

  async fetch_doc(path: string): Promise<CicDoc> {
    const file = Path.isAbsolute(path)
      ? path
      : Path.resolve(this.root_dir, this.config.src, path)
    const text = await fs.promises.readFile(file, "utf8")
    return new CicDoc({ library: this, text })
  }

  async fetch_docs(): Promise<Record<string, CicDoc>> {
    const src_dir = Path.resolve(this.root_dir, this.config.src)

    const docs: Record<string, CicDoc> = {}
    for await (const { path } of readdirp(src_dir)) {
      if (path.endsWith(".cic")) {
        docs[path] = await this.fetch_doc(path)
      }
    }

    return docs
  }

  async load(
    path: string,
    opts: {
      verbose?: boolean
      silent?: boolean
    } = {
      verbose: false,
      silent: false,
    }
  ): Promise<Module> {
    const cached = this.cached_mods.get(path)
    if (cached) {
      if (opts.verbose) {
        console.log(chalk.bold("(load)"), chalk.bold.blue("[cached]"), path)
      }
      return cached
    }

    const t0 = Date.now()
    const doc = await this.fetch_doc(path)
    const t1 = Date.now()
    const mod = await Module.from_doc(doc)
    const t2 = Date.now()

    if (opts.silent === false && mod.output) {
      console.log(mod.output)
    }

    if (opts.verbose) {
      console.log(
        chalk.bold("(load)"),
        chalk.green.bold(`[parse: ${t1 - t0}ms, execute: ${t2 - t1}ms]`),
        path
      )
    }

    this.cached_mods.set(path, mod)
    return mod
  }

  async reload(
    path: string,
    opts: {
      verbose?: boolean
      silent?: boolean
    } = {
      verbose: false,
      silent: false,
    }
  ): Promise<Module> {
    this.cached_mods.delete(path)
    return await this.load(path, opts)
  }

  async load_mods(
    opts: {
      verbose?: boolean
      silent?: boolean
    } = {
      verbose: false,
      silent: true,
    }
  ): Promise<Map<string, Module>> {
    const files = await this.fetch_files()
    for (const path of Object.keys(files)) {
      await this.load(path, opts)
    }

    return this.cached_mods
  }
}
