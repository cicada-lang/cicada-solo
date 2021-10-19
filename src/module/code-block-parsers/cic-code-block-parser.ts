import { CodeBlockParser } from "../code-block-parser"
import { CodeBlock } from "../code-block"
import { Parser } from "../../parser"
import { Stmt } from "../../stmt"

export class CicCodeBlockParser extends CodeBlockParser {
  parse_code_blocks(text: string): Array<CodeBlock> {
    const parser = new Parser()
    const stmts = parser.parse_stmts(text)
    return [new CodeBlock({ id: 0, code: text, stmts })]
  }
}
