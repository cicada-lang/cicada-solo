import { Library } from "../library"
import { Module } from "../module"

// NOTE The responsibility of this class
//   is to parse file to different kinds of doc.
export abstract class ModuleLoader {
  abstract load(library: Library, path: string): Promise<Module>

  private factories: Array<{
    extension: string
    create: (path: string) => ModuleLoader
  }> = []

  register(factory: {
    extension: string
    create: (path: string) => ModuleLoader
  }): void {
    this.factories.push(factory)
  }
}
