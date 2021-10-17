import { Stmt, StmtOutput } from "../stmt"

export interface CodeBlock {
  index: number
  text: string
  stmts: Array<Stmt>
  output?: StmtOutput
}
