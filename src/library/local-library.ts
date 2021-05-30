import { Library, LibraryConfig } from "../library"
import { Module } from "../module"
import * as Syntax from "../syntax"
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

  async fetch_file(path: string): Promise<string> {
    const file = Path.isAbsolute(path)
      ? path
      : Path.resolve(this.root_dir, this.config.src, path)
    const text = await fs.promises.readFile(file, "utf8")
    return text
  }

  async fetch_files(): Promise<Record<string, string>> {
    const src_dir = Path.resolve(this.root_dir, this.config.src)

    const files: Record<string, string> = {}
    for await (const { path } of readdirp(src_dir)) {
      if (path.endsWith(".cic")) {
        const text = await this.fetch_file(path)
        files[path] = text
      }
    }

    return files
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

    const text = await this.fetch_file(path)
    const stmts = Syntax.parse_stmts(text)

    const t1 = Date.now()

    const mod = new Module({ library: this })
    for (const stmt of stmts) {
      await stmt.execute(mod)
    }

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
