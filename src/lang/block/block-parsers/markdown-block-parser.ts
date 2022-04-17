import * as commonmark from "commonmark"
import { BlockParser, BlockResource } from "../../block"
import { InternalError, ParsingError } from "../../errors"
import { Parser } from "../../parser"
import * as Stmts from "../../stmts"

export class MarkdownBlockParser extends BlockParser {
  parseBlocks(text: string): BlockResource {
    const blocks = new BlockResource()
    for (const entry of collect(text)) {
      if (!entry.info.startsWith("cicada")) continue

      if (entry.info === "cicada") {
        defaultHandler(blocks, entry)
      } else if ((entry.info + " ").includes(" compute ")) {
        computeHandler(blocks, entry)
      }
    }

    return blocks
  }
}

function computeHandler(blocks: BlockResource, entry: Entry): void {
  try {
    const parser = new Parser()
    const exp = parser.parseExp(entry.code)
    if (exp.meta?.span === undefined)
      throw new InternalError("I expect exp.meta.span")
    const stmt = new Stmts.Compute(exp, { span: exp.meta.span })
    const entries = [{ stmt }]
    blocks.put(entry.index, entry.code, entries)
  } catch (error) {
    if (error instanceof ParsingError) {
      console.error(error.report(entry.code))
    }

    throw error
  }
}

function defaultHandler(blocks: BlockResource, entry: Entry): void {
  try {
    const parser = new Parser()
    const stmts = parser.parseStmts(entry.code)
    const entries = stmts.map((stmt) => ({ stmt }))
    blocks.put(entry.index, entry.code, entries)
  } catch (error) {
    if (error instanceof ParsingError) {
      console.error(error.report(entry.code))
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
