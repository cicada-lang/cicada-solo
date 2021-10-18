import { Stmt, StmtOutput } from "../stmt"
import { Parser } from "../parser"

export class CodeBlock {
  index: number
  code: string
  stmts: Array<Stmt>
  outputs: Array<StmtOutput> = []

  constructor(opts: { index: number; code: string; stmts: Array<Stmt> }) {
    this.index = opts.index
    this.code = opts.code
    this.stmts = opts.stmts
  }

  updateCode(code: string): void {
    this.code = code
    const parser = new Parser()
    this.stmts = parser.parse_stmts(code)
  }
}
