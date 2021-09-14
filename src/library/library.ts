import { LibraryConfig } from "../library"
import { Module } from "../module"
import { ModuleLoader } from "../module"
import { FileAdapter } from "./file-adapter"

// NOTE in the following interface, caller is responsible to make sure the path exists.
//   maybe this should be changed, and these functions should be able to return `undefined`.
export abstract class Library {
  abstract config: LibraryConfig
  abstract files: FileAdapter

  abstract load(path: string): Promise<Module>
  abstract reload(path: string): Promise<Module>
  abstract load_mods(): Promise<Map<string, Module>>
}
