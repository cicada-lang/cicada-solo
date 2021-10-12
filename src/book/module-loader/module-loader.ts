import { Book } from "../../book"
import { Module } from "../../module"

export abstract class ModuleLoader {
  abstract load(book: Book, path: string): Promise<Module>
}
