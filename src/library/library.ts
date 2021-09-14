import { LibraryConfig } from "../library"
import { Module } from "../module"
import { ModuleLoader } from "../module"
import { FileAdapter } from "./file-adapter"
import { ModuleManager } from "./module-manager"

// NOTE in the following interface, caller is responsible to make sure the path exists.
//   maybe this should be changed, and these functions should be able to return `undefined`.
export abstract class Library {
  abstract config: LibraryConfig
  abstract files: FileAdapter

  get mods(): ModuleManager {
    return new ModuleManager({ library: this })
  }
}
