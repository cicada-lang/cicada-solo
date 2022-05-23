import { BlockResource } from "../block"
import {
  ElaborationError,
  InternalError,
  LangError,
  ParsingError,
} from "../errors"
import { Mod } from "../mod"
import { Parser } from "../parser"
import { Stmt, StmtOutput } from "../stmt"
import * as Stmts from "../stmts"

export type BlockEntry = {
  stmt: Stmt
  output?: StmtOutput
}

export class Block {
  executed?: Array<BlockEntry>

  constructor(
    public blocks: BlockResource,
    public id: number,
    public code: string,
    public info: string
  ) {}

  isCompute(): boolean {
    return (this.info + " ").includes(" compute ")
  }

  get outputs(): Array<undefined | StmtOutput> {
    if (!this.executed) return []
    return this.executed.map(({ output }) => output)
  }

  async run(mod: Mod, code: string): Promise<void> {
    await this.undo(mod)
    this.update(code)
    await this.execute(mod)
  }

  update(code: string): void {
    this.code = code
    delete this.executed
  }

  async execute(mod: Mod): Promise<void> {
    try {
      const blocks = [...this.blocks.before(this), this]
      for (const block of blocks) {
        await block.executeOne(mod)
      }
    } catch (error) {
      if (!(error instanceof ElaborationError)) throw error
      throw new LangError(error.report(this.code))
    }
  }

  private async executeOne(mod: Mod): Promise<void> {
    if (this.executed) return

    this.executed = this.prepareExecuted()
    for (const entry of this.executed) {
      const output = await entry.stmt.execute(mod)
      if (output) {
        entry.output = output
      }
    }
  }

  private prepareExecuted(): Array<BlockEntry> {
    try {
      if (this.isCompute()) {
        return this.parseCompute()
      } else {
        return this.parseStmts()
      }
    } catch (error) {
      if (!(error instanceof ParsingError)) throw error
      throw new LangError(error.report(this.code))
    }
  }

  private parseCompute(): Array<BlockEntry> {
    const parser = new Parser()
    const exp = parser.parseExp(this.code)
    if (exp.meta?.span === undefined)
      throw new InternalError("I expect exp.meta.span")
    const stmt = new Stmts.Compute(exp, { span: exp.meta.span })
    const stmts = [stmt]
    return stmts.map((stmt) => ({ stmt }))
  }

  private parseStmts(): Array<BlockEntry> {
    const parser = new Parser()
    const stmts = parser.parseStmts(this.code)
    return stmts.map((stmt) => ({ stmt }))
  }

  private async undo(mod: Mod): Promise<void> {
    const blocks = [this, ...this.blocks.after(this)].reverse()
    for (const block of blocks) {
      await block.undoOne(mod)
    }
  }

  private async undoOne(mod: Mod): Promise<void> {
    if (!this.executed) return
    for (const entry of this.executed) {
      await entry.stmt.undo(mod)
    }

    delete this.executed
  }
}
