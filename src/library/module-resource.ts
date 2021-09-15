import { Library } from "../library"
import { Module } from "../module"
import { ModuleLoader } from "../module"
import { FileResource } from "./file-resource"

export class ModuleResource {
  library: Library
  files: FileResource
  cache: Map<string, Module> = new Map()

  constructor(opts: { library: Library }) {
    this.library = opts.library
    this.files = opts.library.files
  }

  async get(path: string): Promise<Module> {
    const cached = this.cache.get(path)
    if (cached) {
      return cached
    }

    const mod = await ModuleLoader.load(this.library, path)
    await mod.execute()

    this.cache.set(path, mod)
    return mod
  }

  async all(): Promise<Map<string, Module>> {
    const files = await this.files.all()
    for (const path of Object.keys(files)) {
      await this.get(path)
    }

    return this.cache
  }
}
