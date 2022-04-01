import { Parser } from "../parser"
import { Stmt, StmtOutput } from "../stmt"

export class Block {
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
