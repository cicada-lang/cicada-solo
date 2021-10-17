import { Stmt } from "../../stmt"

export abstract class CodeBlockParser {
  abstract parse_stmts(text: string): Array<Stmt>
}
