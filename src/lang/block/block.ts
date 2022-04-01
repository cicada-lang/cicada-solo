import { Parser } from "../parser"
import { Stmt, StmtOutput } from "../stmt"

export type StmtEntry = {
  stmt: Stmt
  output?: StmtOutput
}

export class Block {
  constructor(
    public id: number,
    public code: string,
    public stmts: Array<StmtEntry>
  ) {}

  get outputs(): Array<undefined | StmtOutput> {
    return this.stmts.map(({ output }) => output)
  }

  updateCode(code: string): void {
    this.code = code
    const parser = new Parser()
    this.stmts = parser.parse_stmts(code).map((stmt) => ({ stmt }))
  }
}
