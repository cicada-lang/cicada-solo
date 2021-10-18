import { Stmt, StmtOutput } from "../stmt"

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
}
