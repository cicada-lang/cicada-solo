import { Book } from "../book"
import { Module } from "../module"

export abstract class ModuleLoader {
  abstract load(library: Book, path: string): Promise<Module>
}
