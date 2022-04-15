import { BlockResource } from "../block"
import { Parser } from "../parser"
import { Stmt, StmtOutput } from "../stmt"

export type BlockEntry = {
  stmt: Stmt
  output?: StmtOutput
}

export class Block {
  constructor(
    public blocks: BlockResource,
    public id: number,
    public code: string,
    public entries: Array<BlockEntry>
  ) {}

  get outputs(): Array<undefined | StmtOutput> {
    return this.entries.map(({ output }) => output)
  }

  updateCode(code: string): void {
    this.code = code
    const parser = new Parser()
    this.entries = parser.parseStmts(code).map((stmt) => ({ stmt }))
  }
}
