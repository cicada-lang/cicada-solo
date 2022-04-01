import { Parser } from "../../parser"
import { Block } from "../block"
import { BlockParser } from "../block-parser"

export class CicBlockParser extends BlockParser {
  parseBlocks(text: string): Array<Block> {
    const parser = new Parser()
    const stmts = parser.parse_stmts(text)
    return [
      new Block(
        0,
        text,
        stmts.map((stmt) => ({ stmt }))
      ),
    ]
  }
}
