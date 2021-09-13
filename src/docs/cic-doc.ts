import { Doc } from "../doc"
import { Library } from "../library"
import { Module } from "../module"
import { Stmt } from "../stmt"
import * as Syntax from "../syntax"

export class CicDoc extends Doc {
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
