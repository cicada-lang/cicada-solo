import { ModuleLoader } from "../module-loader"
import { Library } from "../library"
import { Module } from "../module"
import { Parser } from "../parser"

export class CicModuleLoader extends ModuleLoader {
  async load(library: Library, path: string): Promise<Module> {
    const text = await library.files.get(path)
    const parser = new Parser()
    const stmts = parser.parse_stmts(text)
    return new Module({ library, path, stmts })
  }
}
