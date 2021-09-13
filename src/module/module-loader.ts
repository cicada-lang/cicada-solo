import { Library } from "../library"
import { Module } from "../module"

// NOTE The responsibility of this class
//   is to parse file to different kinds of doc.
export abstract class ModuleLoader {
  abstract path: string
  abstract load(library: Library): Promise<Module>

  get extension(): string {
    const parts = this.path.split(".")
    if (parts.length === 0) {
      return ""
    }

    const extension = parts[parts.length - 1]
    return extension
  }

  get total_extension(): string {
    const parts = this.path.split(".")
    if (parts.length === 0) {
      return ""
    }

    const total_extension = parts.slice(1).join(".")
    return total_extension
  }
}
