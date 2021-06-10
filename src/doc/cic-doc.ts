import { Doc, DocEntry } from "../doc"
import { Library } from "../library"
import * as Syntax from "../syntax"

export class CicDoc extends Doc {
  library: Library
  text: string
  extension: string
  total_extension: string

  constructor(opts: {
    library: Library
    text: string
    extension: string
    total_extension: string
  }) {
    super()
    this.library = opts.library
    this.text = opts.text
    this.extension = opts.extension
    this.total_extension = opts.total_extension
  }

  get entries(): Array<DocEntry> {
    const stmts = Syntax.parse_stmts(this.text)
    return stmts.map((stmt) => new DocEntry({ stmt }))
  }
}
