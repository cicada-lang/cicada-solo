import * as commonmark from "commonmark"
import { BlockParser, BlockResource } from "../../block"
import { LangError, ParsingError } from "../../errors"

export class MarkdownBlockParser extends BlockParser {
  parseBlocks(text: string): BlockResource {
    const blocks = new BlockResource()
    for (const entry of collect(text)) {
      if (!entry.info.startsWith("cicada")) continue

      if (entry.info === "cicada" || (entry.info + " ").includes(" compute ")) {
        defaultHandler(blocks, entry)
      }
    }

    return blocks
  }
}

function defaultHandler(blocks: BlockResource, entry: Entry): void {
  try {
    blocks.put(entry.index, entry.code, entry.info)
  } catch (error) {
    if (error instanceof ParsingError) {
      throw new LangError(error.report(entry.code))
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
