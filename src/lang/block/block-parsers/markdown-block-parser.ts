import pt from "@cicada-lang/partech"
import * as commonmark from "commonmark"
import { BlockParser, BlockResource } from "../../block"
import { ParsingError } from "../../errors"
import { Parser } from "../../parser"

export class MarkdownBlockParser extends BlockParser {
  parseBlocks(text: string): BlockResource {
    const blocks = new BlockResource()
    for (const entry of collect(text)) {
      if (entry.info === "cicada") {
        defaultHandler(blocks, entry)
      }
    }

    return blocks
  }
}

function defaultHandler(blocks: BlockResource, entry: Entry): void {
  try {
    const parser = new Parser()
    const stmts = parser.parseStmts(entry.code)
    blocks.put(
      entry.index,
      entry.code,
      stmts.map((stmt) => ({ stmt }))
    )
  } catch (error) {
    if (error instanceof ParsingError) {
      console.error(pt.report(error.span, entry.code))
    }

    throw error
  }
}

type Entry = { index: number; info: string; code: string }

function collect(text: string): Array<Entry> {
  const reader = new commonmark.Parser()
  const parsed: commonmark.Node = reader.parse(text)

  const entries = []

  const walker = parsed.walker()

  let counter = 0

  let event, node
  while ((event = walker.next())) {
    node = event.node

    if (event.entering && node.type === "code_block") {
      const [start_pos, _end_pos] = node.sourcepos
      const [row, col] = start_pos
      entries.push({
        index: counter++,
        info: node.info || "",
        code: node.literal || "",
      })
    }
  }

  return entries
}
