import { Stmt, StmtOutput } from "../stmt"

export interface CodeBlock {
  index: string
  text: string
  stmts: Array<Stmt>
  output?: StmtOutput
}
