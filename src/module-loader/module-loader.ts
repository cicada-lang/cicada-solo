import { Library } from "../library"
import { Module } from "../module"

export abstract class ModuleLoader {
  abstract load(library: Library, path: string): Promise<Module>

  private static loaders: Array<{ extension: string; loader: ModuleLoader }> =
    []

  static register(opts: { extension: string; loader: ModuleLoader }): void {
    this.loaders.push(opts)
  }

  static can_handle(path: string): boolean {
    return this.loaders.some(({ extension }) => path.endsWith(extension))
  }
}
