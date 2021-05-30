import { Doc, DocEntry } from "../doc"
import { Library } from "../library"
import * as Syntax from "../syntax"
import * as commonmark from "commonmark"

export class MdDoc extends Doc {
  library: Library
  text: string

  constructor(opts: { library: Library; text: string }) {
    super()
    this.library = opts.library
    this.text = opts.text
  }

  get entries(): Array<DocEntry> {
    return this.code_blocks.flatMap((code_block) =>
      Syntax.parse_stmts(code_block.text).map((stmt) => new DocEntry({ stmt }))
    )
  }

  get code_blocks(): Array<{ info: string; text: string }> {
    const reader = new commonmark.Parser()
    const writer = new commonmark.HtmlRenderer()
    const parsed: commonmark.Node = reader.parse(this.text)

    const code_blocks: Array<{ info: string; text: string }> = []

    const walker = parsed.walker()

    let event, node
    while ((event = walker.next())) {
      node = event.node

      if (event.entering && node.type === "code_block") {
        if (node.literal && node.info === "cicada") {
          // TODO use node.sourcepos
          code_blocks.push({ info: node.info, text: node.literal })
        }
      }
    }

    return code_blocks
  }
}
