import { Library, LibraryConfig } from "../library"
import { FileAdapter } from "../library/file-adapter"
import { LocalFileAdapter } from "../library/file-adapters"
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
  files: FileAdapter

  constructor(opts: {
    root_dir: string
    config: LibraryConfig
    cached_mods?: Map<string, Module>
  }) {
    super()
    this.root_dir = opts.root_dir
    this.config = opts.config
    this.cached_mods = opts.cached_mods || new Map()
    this.files = new LocalFileAdapter(opts)
  }

  static async from_config_file<Module>(file: string): Promise<LocalLibrary> {
    const text = await fs.promises.readFile(file, "utf8")
    return new LocalLibrary({
      root_dir: Path.dirname(file),
      config: new LibraryConfig(JSON.parse(text)),
    })
  }
}
