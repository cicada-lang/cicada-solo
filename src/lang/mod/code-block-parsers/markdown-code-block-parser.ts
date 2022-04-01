import * as commonmark from "commonmark"
import { Parser } from "../../parser"
import { CodeBlock } from "../code-block"
import { CodeBlockParser } from "../code-block-parser"

export class MarkdownCodeBlockParser extends CodeBlockParser {
  parseCodeBlocks(text: string): Array<CodeBlock> {
    const parser = new Parser()
    return collectCodeBlocks(text)
      .filter(({ info }) => info === "cicada")
      .map(
        ({ index, text, offset }) =>
          new CodeBlock({
            id: index,
            code: text,
            stmts: parser.parse_stmts(text, offset),
          })
      )
  }
}

function collectCodeBlocks(text: string): Array<{
  index: number
  info: string
  text: string
  offset: number
}> {
  const reader = new commonmark.Parser()
  const parsed: commonmark.Node = reader.parse(text)

  const codeBlocks = []

  const walker = parsed.walker()

  let counter = 0

  let event, node
  while ((event = walker.next())) {
    node = event.node

    if (event.entering && node.type === "code_block") {
      const [start_pos, _end_pos] = node.sourcepos
      const [row, col] = start_pos
      codeBlocks.push({
        index: counter++,
        info: node.info || "",
        text: node.literal || "",
        offset: offsetFromPosition(text, row, col),
      })
    }
  }

  return codeBlocks
}

function offsetFromPosition(text: string, row: number, col: number): number {
  const lines = text.split("\n")
  return lines.slice(0, row).join("\n").length + col
}
