import { Stmt, StmtOutput } from "../stmt"

export class CodeBlock {
  instanceofCodeBlock = true

  index: number
  text: string
  stmts: Array<Stmt>
  outputs: Array<StmtOutput> = []

  constructor(opts: { index: number; text: string; stmts: Array<Stmt> }) {
    this.index = opts.index
    this.text = opts.text
    this.stmts = opts.stmts
  }
}
