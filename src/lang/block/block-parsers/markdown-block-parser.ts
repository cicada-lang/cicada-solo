import * as commonmark from "commonmark"
import { Parser } from "../../parser"
import { Block } from "../block"
import { BlockParser } from "../block-parser"

export class MarkdownBlockParser extends BlockParser {
  parseBlocks(text: string): Array<Block> {
    const parser = new Parser()
    return collectBlocks(text)
      .filter(({ info }) => info === "cicada")
      .map(
        ({ index, text, offset }) =>
          new Block(
            index,
            text,
            parser.parse_stmts(text, offset).map((stmt) => ({ stmt }))
          )
      )
  }
}

function collectBlocks(text: string): Array<{
  index: number
  info: string
  text: string
  offset: number
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
        text: node.literal || "",
        offset: offsetFromPosition(text, row, col),
      })
    }
  }

  return blocks
}

function offsetFromPosition(text: string, row: number, col: number): number {
  const lines = text.split("\n")
  return lines.slice(0, row).join("\n").length + col
}
