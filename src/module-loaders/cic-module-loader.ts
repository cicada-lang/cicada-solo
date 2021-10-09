import { ModuleLoader } from "../module-loader"
import { Book } from "../book"
import { Module } from "../module"
import { Parser } from "../parser"

export class CicModuleLoader extends ModuleLoader {
  async load(book: Book, path: string): Promise<Module> {
    const text = await book.files.getOrFail(path)
    const parser = new Parser()
    const stmts = parser.parse_stmts(text)
    return new Module({ book, path, stmts })
  }
}
