import { Doc } from "../doc"
import { Library } from "../library"
import { Module } from "../module"
import { Stmt } from "../stmt"
import * as Syntax from "../syntax"

export class CicDoc extends Doc<Module> {
  library: Library<Module>
  text: string
  path: string

  constructor(opts: { library: Library<Module>; text: string; path: string }) {
    super()
    this.library = opts.library
    this.text = opts.text
    this.path = opts.path
  }

  async load(): Promise<Module> {
    const mod = new Module({ library: this.library })
    for (const stmt of this.stmts) {
      await stmt.execute(mod)
    }
    return mod
  }

  private get stmts(): Array<Stmt> {
    return Syntax.parse_stmts(this.text)
  }
}
