import { Library } from "../library"
import { Module } from "../module"

export abstract class ModuleLoader {
  abstract load(library: Library, path: string): Promise<Module>

  private static loaders: Array<{ extension: string; loader: ModuleLoader }> =
    []

  static register(opts: { extension: string; loader: ModuleLoader }): void {
    this.loaders.push(opts)
  }

  static can_load(path: string): boolean {
    return this.loaders.some(({ extension }) => path.endsWith(extension))
  }

  private static create(path: string): ModuleLoader {
    for (const { extension, loader } of this.loaders) {
      if (path.endsWith(extension)) {
        return loader
      }
    }

    throw new Error(
      `When try to create doc from file, I met path with unknown ext: ${path}`
    )
  }

  static load(library: Library, path: string): Promise<Module> {
    return this.create(path).load(library, path)
  }
}
