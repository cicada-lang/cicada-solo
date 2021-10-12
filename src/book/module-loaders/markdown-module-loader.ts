import { ModuleLoader } from "../module-loader"
import { Book } from "../../book"
import { Module } from "../../module"
import { Parser } from "../../parser"
import { Stmt } from "../../stmt"
import * as commonmark from "commonmark"

export class MarkdownModuleLoader extends ModuleLoader {
  parse(text: string): Array<Stmt> {
    const parser = new Parser()
    const stmts = code_blocks(text).flatMap((code_block) =>
      parser.parse_stmts(code_block.text, code_block.offset)
    )
    return stmts
  }
}

function code_blocks(text: string): Array<{
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
          offset: offset_from_pos(text, row, col),
        })
      }
    }
  }

  return code_blocks
}

function offset_from_pos(text: string, row: number, col: number): number {
  const lines = text.split("\n")
  return lines.slice(0, row).join("\n").length + col
}
