import { BlockParser, BlockResource } from "../../block"
import { LangError, ParsingError } from "../../errors"
import { Parser } from "../../parser"

export class WholeBlockParser extends BlockParser {
  parseBlocks(text: string): BlockResource {
    const blocks = new BlockResource()

    try {
      const parser = new Parser()
      const stmts = parser.parseStmts(text)
      blocks.put(0, text, "cicada")
      return blocks
    } catch (error) {
      if (error instanceof ParsingError) {
        throw new LangError(error.report(text))
      }

      throw error
    }
  }
}
