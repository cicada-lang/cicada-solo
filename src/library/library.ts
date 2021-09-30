import { Module } from "../module"
import * as ModuleLoaders from "../module-loaders"
import { FileStore } from "../file-store"
import { Reporter } from "./reporter"
import ty from "@xieyuheng/ty"
import { customAlphabet } from "nanoid"
const nanoid = customAlphabet("1234567890abcdef", 16)

export type LibraryConfig = {
  name: string
  version: string
  src: string
}

export class Library {
  config: LibraryConfig
  files: FileStore
  cache: Map<string, Module> = new Map()

  constructor(opts: { config: LibraryConfig; files: FileStore }) {
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

  get reporter(): Reporter {
    return new Reporter({ files: this.files })
  }

  info(): string {
    return [
      `library:`,
      `  name: ${this.config.name}`,
      `  version: ${this.config.version}`,
    ].join("\n")
  }
}
