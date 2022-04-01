import { Parser } from "../../parser"
import { CodeBlock } from "../code-block"
import { CodeBlockParser } from "../code-block-parser"

export class CicCodeBlockParser extends CodeBlockParser {
  parseCodeBlocks(text: string): Array<CodeBlock> {
    const parser = new Parser()
    const stmts = parser.parse_stmts(text)
    return [new CodeBlock({ id: 0, code: text, stmts })]
  }
}
