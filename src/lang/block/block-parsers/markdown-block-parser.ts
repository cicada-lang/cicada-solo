import pt from "@cicada-lang/partech"
import * as commonmark from "commonmark"
import { BlockParser, BlockResource } from "../../block"
import { ParsingError } from "../../errors"
import { Parser } from "../../parser"

export class MarkdownBlockParser extends BlockParser {
  parseBlocks(text: string): BlockResource {
    const blocks = new BlockResource()
    const parser = new Parser()
    for (const { index, code } of collectBlocks(text).filter(
      ({ info }) => info === "cicada"
    )) {
      try {
        const stmts = parser.parseStmts(code)
        const entries = stmts.map((stmt) => ({ stmt }))
        blocks.put(index, code, entries)
      } catch (error) {
        if (error instanceof ParsingError) {
          console.error(pt.report(error.span, text))
        }

        throw error
      }
    }
    return blocks
  }
}

function collectBlocks(text: string): Array<{
  index: number
  info: string
  code: string
}> {
  const reader = new commonmark.Parser()
  const parsed: commonmark.Node = reader.parse(text)

  const blocks = []

  const walker = parsed.walker()

  let counter = 0

  let event, node
  while ((event = walker.next())) {
    node = event.node

    if (event.entering && node.type === "code_block") {
      const [start_pos, _end_pos] = node.sourcepos
      const [row, col] = start_pos
      blocks.push({
        index: counter++,
        info: node.info || "",
        code: node.literal || "",
      })
    }
  }

  return blocks
}
