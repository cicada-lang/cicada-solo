import { ModuleLoader } from "../module-loader"
import { Library } from "../../library"
import { Module } from "../../module"
import * as Syntax from "../../syntax"

export class CicModuleLoader extends ModuleLoader {
  path: string

  constructor(opts: { path: string }) {
    super()
    this.path = opts.path
  }

  async load(library: Library): Promise<Module> {
    const text = await library.fetch_file(this.path)

    return new Module({
      library,
      path: this.path,
      text,
      stmts: Syntax.parse_stmts(text),
    })
  }
}
