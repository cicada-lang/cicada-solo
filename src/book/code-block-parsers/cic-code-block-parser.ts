import { CodeBlockParser } from "../code-block-parser"
import { Parser } from "../../parser"
import { Stmt } from "../../stmt"

export class CicCodeBlockParser extends CodeBlockParser {
  parse_stmts(text: string): Array<Stmt> {
    const parser = new Parser()
    const stmts = parser.parse_stmts(text)
    return stmts
  }
}
