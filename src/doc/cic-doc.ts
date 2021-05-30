import { Library } from "../library"
import * as Syntax from "../syntax"
import { Doc, DocEntry } from "./doc"

export class CicDoc extends Doc {
  library: Library
  text: string

  constructor(opts: { library: Library; text: string }) {
    super()
    this.library = opts.library
    this.text = opts.text
  }

  get entries(): Array<DocEntry> {
    const stmts = Syntax.parse_stmts(this.text)
    return stmts.map(stmt => new DocEntry({ stmt }))
  }
}
