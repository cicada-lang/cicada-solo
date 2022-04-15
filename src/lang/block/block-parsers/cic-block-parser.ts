import pt from "@cicada-lang/partech"
import { BlockParser, BlockResource } from "../../block"
import { ParsingError } from "../../errors"
import { Parser } from "../../parser"

export class CicBlockParser extends BlockParser {
  parseBlocks(text: string): BlockResource {
    const blocks = new BlockResource()

    try {
      const parser = new Parser()
      const stmts = parser.parseStmts(text)
      const entries = stmts.map((stmt) => ({ stmt }))
      blocks.put(0, text, entries)
      return blocks
    } catch (error) {
      if (error instanceof ParsingError) {
        console.error(pt.report(error.span, text))
      }

      throw error
    }
  }
}
