import { CodeBlockParser } from "../code-block-parser"
import { CodeBlock } from "../code-block"
import { Parser } from "../../lang/parser"
import * as commonmark from "commonmark"

export class MarkdownCodeBlockParser extends CodeBlockParser {
  parse_code_blocks(text: string): Array<CodeBlock> {
    const parser = new Parser()
    return collect_code_blocks(text)
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

function collect_code_blocks(text: string): Array<{
  index: number
  info: string
  text: string
  offset: number
}> {
  const reader = new commonmark.Parser()
  const writer = new commonmark.HtmlRenderer()
  const parsed: commonmark.Node = reader.parse(text)

  const code_blocks = []

  const walker = parsed.walker()

  let counter = 0

  let event, node
  while ((event = walker.next())) {
    node = event.node

    if (event.entering && node.type === "code_block") {
      const [start_pos, _end_pos] = node.sourcepos
      const [row, col] = start_pos
      code_blocks.push({
        index: counter++,
        info: node.info || "",
        text: node.literal || "",
        offset: offset_from_pos(text, row, col),
      })
    }
  }

  return code_blocks
}

function offset_from_pos(text: string, row: number, col: number): number {
  const lines = text.split("\n")
  return lines.slice(0, row).join("\n").length + col
}
