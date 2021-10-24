import { Book } from "../book"
import { Stmt, StmtOutput } from "../lang/stmt"
import { Env } from "../lang/env"
import { Ctx } from "../lang/ctx"
import { Parser } from "../lang/parser"
import { CodeBlock } from "./code-block"

export class Module {
  book: Book
  path: string
  codeBlocks: Array<CodeBlock>
  env: Env
  ctx: Ctx

  private backups: Array<{ env: Env; ctx: Ctx }> = []

  private get counter(): number {
    return this.backups.length
  }

  constructor(opts: {
    book: Book
    path: string
    codeBlocks: Array<CodeBlock>
    env: Env
    ctx: Ctx
  }) {
    this.book = opts.book
    this.path = opts.path
    this.codeBlocks = opts.codeBlocks
    this.env = opts.env
    this.ctx = opts.ctx
  }

  appendCodeBlock(code: string): this {
    const parser = new Parser()
    const stmts = parser.parse_stmts(code)
    this.codeBlocks.push(
      new CodeBlock({
        id: this.codeBlocks.length,
        code,
        stmts,
      })
    )

    return this
  }

  getCodeBlock(id: number): CodeBlock | undefined {
    return this.codeBlocks.find((codeBlock) => codeBlock.id === id)
  }

  updateCodeBlock(id: number, code: string): void {
    const codeBlock = this.getCodeBlock(id)
    if (codeBlock) {
      codeBlock.updateCode(code)
    } else {
      console.warn(`I can not update non-existing code block of id: ${id}`)
    }
  }

  private async step(): Promise<Array<StmtOutput>> {
    const outputs = []

    const codeBlock = this.codeBlocks[this.counter]

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

    const index = this.codeBlocks.findIndex((codeBlock) => codeBlock.id === id)

    if (index === -1) {
      throw new Error(`I can not find code block with id: ${id}`)
    }

    if (index < this.counter) {
      const backup = this.backups[index]
      this.env = backup.env
      this.ctx = backup.ctx
      this.backups = this.backups.slice(0, index)
      for (const [i, codeBlock] of this.codeBlocks.entries()) {
        if (i >= index) {
          codeBlock.outputs = []
        }
      }
    }

    for (const codeBlock of this.codeBlocks.slice(this.counter)) {
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
    while (this.counter < this.codeBlocks.length) {
      outputs.push(...(await this.step()))
    }

    return outputs
  }

  get allOutputs(): Array<StmtOutput> {
    return this.codeBlocks.flatMap(({ outputs }) => outputs)
  }
}
