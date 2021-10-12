import { Book } from "../../book"
import { Stmt } from "../../stmt"
import { Module } from "../../module"

export abstract class ModuleLoader {
  abstract parse(text: string): Array<Stmt>

  async load(book: Book, path: string): Promise<Module> {
    const text = await book.files.getOrFail(path)
    const stmts = this.parse(text)
    return new Module({ book, path, stmts })
  }
}
