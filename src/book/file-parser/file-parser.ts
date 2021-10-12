import { Stmt } from "../../stmt"

export abstract class FileParser {
  abstract parse_stmts(text: string): Array<Stmt>
}
