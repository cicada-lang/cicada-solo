import { LibraryConfig } from "../library"
import { Module } from "../module"
import { ModuleLoader } from "../module"
import { FileAdapter } from "./file-adapter"
import { ModuleManager } from "./module-manager"

// NOTE in the following interface, caller is responsible to make sure the path exists.
//   maybe this should be changed, and these functions should be able to return `undefined`.
export class Library {
  config: LibraryConfig
  files: FileAdapter

  constructor(opts: { config: LibraryConfig; files: FileAdapter }) {
    this.config = opts.config
    this.files = opts.files
  }

  get mods(): ModuleManager {
    return new ModuleManager({ library: this })
  }
}
