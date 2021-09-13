import { Doc } from "../doc"
import { Library } from "../library"
import { Module } from "../module"
import { Stmt } from "../stmt"
import * as Syntax from "../syntax"

export class CicDoc extends Doc {
  text: string
  path: string

  constructor(opts: { text: string; path: string }) {
    super()
    this.text = opts.text
    this.path = opts.path
  }

  async load(library: Library): Promise<Module> {
    return new Module({
      library,
      path: this.path,
      text: this.text,
      stmts: Syntax.parse_stmts(this.text),
    })
  }
}
