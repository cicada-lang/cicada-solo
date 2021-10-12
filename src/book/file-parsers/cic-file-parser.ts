import { FileParser } from "../file-parser"
import { Parser } from "../../parser"
import { Stmt } from "../../stmt"

export class CicFileParser extends FileParser {
  parse_stmts(text: string): Array<Stmt> {
    const parser = new Parser()
    const stmts = parser.parse_stmts(text)
    return stmts
  }
}
