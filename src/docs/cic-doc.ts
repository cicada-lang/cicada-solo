import { Doc, DocEntry } from "../doc"
import { Library } from "../library"
import { Module } from "../module"
import * as Syntax from "../syntax"

export class CicDoc extends Doc {
  library: Library
  text: string
  path: string

  constructor(opts: { library: Library; text: string; path: string }) {
    super()
    this.library = opts.library
    this.text = opts.text
    this.path = opts.path
  }

  async load(): Promise<Module> {
    const mod = new Module({ doc: this })
    for (const { stmt } of this.entries) {
      await stmt.execute(mod)
    }
    return mod
  }

  get entries(): Array<DocEntry> {
    const stmts = Syntax.parse_stmts(this.text)
    return stmts.map((stmt) => new DocEntry({ stmt }))
  }
}
