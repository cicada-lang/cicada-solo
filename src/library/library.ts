import { LibraryConfig } from "../library"
import { Module } from "../module"
import { ModuleLoader } from "../module"

// NOTE in the following interface, caller is responsible to make sure the path exists.
//   maybe this should be changed, and these functions should be able to return `undefined`.
export abstract class Library {
  abstract config: LibraryConfig
  abstract list(): Promise<Array<string>>
  abstract get(path: string): Promise<string>

  async all(): Promise<Record<string, string>> {
    const files: Record<string, string> = {}
    for (const path of await this.list()) {
      if (ModuleLoader.can_load(path)) {
        files[path] = await this.get(path)
      }
    }

    return files
  }

  abstract load(path: string): Promise<Module>
  abstract reload(path: string): Promise<Module>
  abstract load_mods(): Promise<Map<string, Module>>
}
