import { Library, LibraryConfig } from "../library"
import { Module } from "../module"
import * as Syntax from "../syntax"
import Path from "path"
import fs from "fs"
import readdirp from "readdirp"
import chalk from "chalk"

export class LocalLibrary implements Library {
  root_dir: string
  config: LibraryConfig
  cached_mods: Map<string, Module>

  constructor(opts: {
    root_dir: string
    config: LibraryConfig
    cached_mods?: Map<string, Module>
  }) {
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

    const file = Path.isAbsolute(path)
      ? path
      : Path.resolve(this.root_dir, this.config.src, path)
    const text = await fs.promises.readFile(file, "utf8")
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

  async paths(): Promise<Array<string>> {
    const src_dir = Path.resolve(this.root_dir, this.config.src)
    const paths = []
    for await (const { path } of readdirp(src_dir)) {
      paths.push(path)
    }
    return paths
  }

  async load_all(
    opts: {
      verbose?: boolean
      silent?: boolean
    } = {
      verbose: false,
      silent: true,
    }
  ): Promise<Map<string, Module>> {
    const src_dir = Path.resolve(this.root_dir, this.config.src)
    for (const path of await this.paths()) {
      if (path.endsWith(".cic")) {
        await this.load(path, opts)
      }
    }
    return this.cached_mods
  }
}
