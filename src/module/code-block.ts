import { Stmt, StmtOutput } from "../lang/stmt"
import { Parser } from "../lang/parser"

export class CodeBlock {
  id: number
  code: string
  stmts: Array<Stmt>
  outputs: Array<StmtOutput> = []

  constructor(opts: { id: number; code: string; stmts: Array<Stmt> }) {
    this.id = opts.id
    this.code = opts.code
    this.stmts = opts.stmts
  }

  updateCode(code: string): void {
    this.code = code
    const parser = new Parser()
    this.stmts = parser.parse_stmts(code)
  }
}
