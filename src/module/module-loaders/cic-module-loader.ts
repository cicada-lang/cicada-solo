import { ModuleLoader } from "../module-loader"
import { Library } from "../../library"
import { Module } from "../../module"
import * as Syntax from "../../syntax"

export class CicModuleLoader extends ModuleLoader {
  async load(library: Library, path: string): Promise<Module> {
    const text = await library.fetch_file(path)
    const stmts = Syntax.parse_stmts(text)
    return new Module({ library, path, text, stmts })
  }
}

ModuleLoader.register({
  extension: ".cic",
  loader: new CicModuleLoader(),
})
