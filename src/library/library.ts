import { Module } from "../module"
import { ModuleLoader } from "../module"
import { FileResource } from "../file-resource"
import { LibraryConfig } from "./library-config"
import { Reporter } from "./reporter"

export class Library {
  files: FileResource
  cache: Map<string, Module> = new Map()

  constructor(opts: { files: FileResource }) {
    this.files = opts.files
  }

  async load(path: string): Promise<Module> {
    const cached = this.cache.get(path)
    if (cached) {
      return cached
    }

    const mod = await ModuleLoader.load(this, path)
    this.cache.set(path, mod)
    return mod
  }

  get reporter(): Reporter {
    return new Reporter({ files: this.files })
  }

  info(): string {
    return [
      `file-resource:`,
      `  name: ${this.files.config.name}`,
      `  version: ${this.files.config.version}`,
      ``,
    ].join("\n")
  }
}
