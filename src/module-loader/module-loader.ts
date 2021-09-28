import { Library } from "../library"
import { Module } from "../module"

export abstract class ModuleLoader {
  abstract load(library: Library, path: string): Promise<Module>
}
