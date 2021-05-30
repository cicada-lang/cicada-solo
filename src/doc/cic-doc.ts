import { Library } from "../library"
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
    // TODO
    return []
  }
}
