import { Module } from "../module"
import * as ModuleLoaders from "../module-loaders"
import { FileStore } from "@xieyuheng/enchanter/lib/file-store"
import ty from "@xieyuheng/ty"
import { customAlphabet } from "nanoid"
const nanoid = customAlphabet("1234567890abcdef", 16)

export type LibraryConfig = {
  name: string
  version: string
  src: string
}

export class Library<Files extends FileStore = FileStore> {
  config: LibraryConfig
  files: Files
  cache: Map<string, Module> = new Map()

  constructor(opts: { config: LibraryConfig; files: Files }) {
    this.config = opts.config
    this.files = opts.files
  }

  static config_schema = ty.object<LibraryConfig>({
    name: ty.string(),
    version: ty.semver(),
    src: ty.string(),
  })

  static fake_config(): LibraryConfig {
    return Library.config_schema.validate({
      name: `<fake-library-${nanoid()}>`,
      version: "0.0.0",
      src: "src",
    })
  }

  async load(path: string): Promise<Module> {
    const cached = this.cache.get(path)
    if (cached) {
      return cached
    }

    const loader = ModuleLoaders.from_path(path)
    const mod = await loader.load(this, path)
    this.cache.set(path, mod)
    return mod
  }
}
