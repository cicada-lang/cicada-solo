import { Library } from "../library"
import { Stmt } from "../stmt"

export class DocEntry {
  stmt: Stmt

  constructor(opts: { stmt: Stmt }) {
    this.stmt = opts.stmt
  }
}

// NOTE The responsibility of this class
//   is to parse file to different kinds of doc.
export abstract class Doc {
  abstract library: Library
  abstract text: string
  abstract entries: Array<DocEntry>
  abstract path: string

  get extension(): string {
    const parts = this.path.split(".")
    if (parts.length === 0) {
      return ""
    }

    const extension = parts[parts.length - 1]
    return extension
  }

  get total_extension(): string {
    const parts = this.path.split(".")
    if (parts.length === 0) {
      return ""
    }

    const total_extension = parts.slice(1).join(".")
    return total_extension
  }
}
