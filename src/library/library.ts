import { Module } from "../module"
import { ModuleLoader } from "../module"
import { FileResource } from "./file-resource"
import { ModuleResource } from "./module-resource"
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
    await mod.run()

    this.cache.set(path, mod)
    return mod
  }

  get reporter(): Reporter {
    return new Reporter({ files: this.files })
  }
}
