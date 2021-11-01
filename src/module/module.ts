import { Book } from "../book"
import { Stmt, StmtOutput } from "../lang/stmt"
import { Env } from "../lang/env"
import { Ctx } from "../lang/ctx"
import { Parser } from "../lang/parser"
import { CodeBlock } from "./code-block"
import { CodeBlockResource } from "./code-block-resource"

export class Module {
  book: Book
  path: string
  codeBlocks: CodeBlockResource
  env: Env
  ctx: Ctx

  private backups: Array<{ env: Env; ctx: Ctx }> = []

  constructor(opts: {
    book: Book
    path: string
    codeBlocks: CodeBlockResource
    env: Env
    ctx: Ctx
  }) {
    this.book = opts.book
    this.path = opts.path
    this.codeBlocks = opts.codeBlocks
    this.env = opts.env
    this.ctx = opts.ctx
  }

  private async step(): Promise<Array<StmtOutput>> {
    const outputs = []
    const codeBlock = this.codeBlocks.nextOrFail()
    this.backups.push({ env: this.env, ctx: this.ctx })
    for (const stmt of codeBlock.stmts) {
      const output = await stmt.execute(this)
      if (output) {
        outputs.push(output)
      }
    }

    codeBlock.outputs = outputs
    return outputs
  }

  async rerunWith(opts: {
    id: number
    code: string
  }): Promise<Array<StmtOutput>> {
    const { id, code } = opts

    if (!this.codeBlocks.has(id)) {
      throw new Error(`I can not find code block with id: ${id}`)
    }

    const index = id

    if (index < this.codeBlocks.counter) {
      const backup = this.backups[index]
      this.env = backup.env
      this.ctx = backup.ctx
      this.backups = this.backups.slice(0, index)
      this.codeBlocks.eraseOutputFrom(index)
    }

    for (const codeBlock of this.codeBlocks.array.slice(
      this.codeBlocks.counter
    )) {
      if (codeBlock.id === id) {
        codeBlock.updateCode(code)
        return await this.step()
      } else {
        await this.step()
      }
    }

    throw new Error(`I can not find code block with id: ${id}`)
  }

  async runAll(): Promise<Array<StmtOutput>> {
    const outputs = []
    while (!this.codeBlocks.isEnd()) {
      outputs.push(...(await this.step()))
    }

    return outputs
  }
}
