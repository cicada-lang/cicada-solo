import { Module } from "../module"
import * as ModuleLoaders from "../module-loaders"
import { FileResource } from "../file-resource"
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

    const loader = ModuleLoaders.from_path(path)
    const mod = await loader.load(this, path)
    this.cache.set(path, mod)
    return mod
  }

  get reporter(): Reporter {
    return new Reporter({ files: this.files })
  }
}
