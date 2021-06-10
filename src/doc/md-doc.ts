import { Doc, DocEntry } from "../doc"
import { Library } from "../library"
import * as Syntax from "../syntax"
import * as commonmark from "commonmark"

export class MdDoc extends Doc {
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
    return this.code_blocks.flatMap((code_block) =>
      Syntax.parse_stmts(code_block.text, code_block.offset).map(
        (stmt) => new DocEntry({ stmt })
      )
    )
  }

  private offset_from_pos(row: number, col: number): number {
    const lines = this.text.split("\n")
    return lines.slice(0, row).join("\n").length + col
  }

  get code_blocks(): Array<{ info: string; text: string; offset: number }> {
    const reader = new commonmark.Parser()
    const writer = new commonmark.HtmlRenderer()
    const parsed: commonmark.Node = reader.parse(this.text)

    const code_blocks = []

    const walker = parsed.walker()

    let event, node
    while ((event = walker.next())) {
      node = event.node

      if (event.entering && node.type === "code_block") {
        if (node.literal && node.info === "cicada") {
          const [start_pos, _end_pos] = node.sourcepos
          const [row, col] = start_pos
          code_blocks.push({
            info: node.info,
            text: node.literal,
            offset: this.offset_from_pos(row, col),
          })
        }
      }
    }

    return code_blocks
  }
}
