import { Library } from "../library"
import { Stmt } from "../stmt"

export class DocEntry {
  stmt: Stmt

  constructor(opts: { stmt: Stmt }) {
    this.stmt = opts.stmt
  }
}

export abstract class Doc {
  abstract library: Library
  abstract text: string
  abstract entry_gen(): AsyncGenerator<DocEntry>
}
