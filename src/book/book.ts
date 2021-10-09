import { Module } from "../module"
import * as ModuleLoaders from "../module-loaders"
import { FileStore } from "@xieyuheng/enchanter/lib/file-store"
import ty from "@xieyuheng/ty"
import { customAlphabet } from "nanoid"
const nanoid = customAlphabet("1234567890abcdef", 16)

export type BookConfig = {
  name: string
  version: string
  src: string
}

export class Book<Files extends FileStore = FileStore> {
  config: BookConfig
  files: Files
  cache: Map<string, Module> = new Map()

  constructor(opts: { config: BookConfig; files: Files }) {
    this.config = opts.config
    this.files = opts.files
  }

  static config_schema = ty.object<BookConfig>({
    name: ty.string(),
    version: ty.semver(),
    src: ty.string(),
  })

  static fake_config(): BookConfig {
    return Book.config_schema.validate({
      name: `<fake-book-${nanoid()}>`,
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
