import { Library, LibraryConfig, DocBuilder } from "../library"
import { Module } from "../module"
import { Doc } from "../doc"
import Path from "path"
import fs from "fs"
import readdirp from "readdirp"
import chalk from "chalk"

export class LocalLibrary extends Library {
  root_dir: string
  config: LibraryConfig
  cached_mods: Map<string, Module>
  doc_builder: DocBuilder

  constructor(opts: {
    root_dir: string
    config: LibraryConfig
    cached_mods?: Map<string, Module>
    doc_builder: DocBuilder
  }) {
    super()
    this.root_dir = opts.root_dir
    this.config = opts.config
    this.cached_mods = opts.cached_mods || new Map()
    this.doc_builder = opts.doc_builder
  }

  static async from_config_file<Module>(
    file: string,
    opts: {
      doc_builder: DocBuilder
    }
  ): Promise<LocalLibrary> {
    const text = await fs.promises.readFile(file, "utf8")
    return new LocalLibrary({
      root_dir: Path.dirname(file),
      config: new LibraryConfig(JSON.parse(text)),
      doc_builder: opts.doc_builder,
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

  async fetch_doc(path: string): Promise<Doc> {
    const file = Path.isAbsolute(path)
      ? path
      : Path.resolve(this.root_dir, this.config.src, path)
    const text = await fs.promises.readFile(file, "utf8")
    return this.doc_builder.from_file({ path, text, library: this })
  }

  async fetch_docs(): Promise<Record<string, Doc>> {
    const src_dir = Path.resolve(this.root_dir, this.config.src)

    const docs: Record<string, Doc> = {}
    for await (const { path } of readdirp(src_dir)) {
      if (this.doc_builder.right_extension_p(path)) {
        docs[path] = await this.fetch_doc(path)
      }
    }

    return docs
  }

  async load(
    path: string,
    opts: {
      verbose?: boolean
    } = {
      verbose: false,
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
    const mod = await doc.load(this)
    const t1 = Date.now()

    if (opts.verbose) {
      console.log(
        chalk.bold("(load)"),
        chalk.green.bold(`[elapse: ${t1 - t0}ms]`),
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
    } = {
      verbose: false,
    }
  ): Promise<Module> {
    this.cached_mods.delete(path)
    return await this.load(path, opts)
  }

  async load_mods(
    opts: {
      verbose?: boolean
    } = {
      verbose: false,
    }
  ): Promise<Map<string, Module>> {
    const files = await this.fetch_files()
    for (const path of Object.keys(files)) {
      await this.load(path, opts)
    }

    return this.cached_mods
  }
}
