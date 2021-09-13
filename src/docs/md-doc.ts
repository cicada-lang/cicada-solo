import { Doc } from "../doc"
import { Library } from "../library"
import { Module } from "../module"
import { Stmt } from "../stmt"
import * as Syntax from "../syntax"
import * as commonmark from "commonmark"

export class MdDoc extends Doc {
  path: string

  constructor(opts: { path: string }) {
    super()
    this.path = opts.path
  }

  async load(library: Library): Promise<Module> {
    const text = await library.fetch_file(this.path)

    return new Module({
      library,
      path: this.path,
      text,
      stmts: this.code_blocks(text).flatMap((code_block) =>
        Syntax.parse_stmts(code_block.text, code_block.offset)
      ),
    })
  }

  private code_blocks(text: string): Array<{
    info: string
    text: string
    offset: number
  }> {
    const reader = new commonmark.Parser()
    const writer = new commonmark.HtmlRenderer()
    const parsed: commonmark.Node = reader.parse(text)

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
            offset: this.offset_from_pos(text, row, col),
          })
        }
      }
    }

    return code_blocks
  }

  private offset_from_pos(text: string, row: number, col: number): number {
    const lines = text.split("\n")
    return lines.slice(0, row).join("\n").length + col
  }
}
