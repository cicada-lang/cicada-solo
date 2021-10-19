import { Book } from "../book"
import { Stmt, StmtOutput } from "../stmt"
import { Env } from "../env"
import { Ctx } from "../ctx"
import { Parser } from "../parser"
import { CodeBlock } from "./code-block"

export class Module {
  book: Book
  path: string
  code_blocks: Array<CodeBlock>
  env: Env
  ctx: Ctx

  private backups: Array<{ env: Env; ctx: Ctx }> = []

  private get counter(): number {
    return this.backups.length
  }

  constructor(opts: {
    book: Book
    path: string
    code_blocks: Array<CodeBlock>
    env: Env
    ctx: Ctx
  }) {
    this.book = opts.book
    this.path = opts.path
    this.code_blocks = opts.code_blocks
    this.env = opts.env
    this.ctx = opts.ctx
  }

  append_code_block(code: string): this {
    const parser = new Parser()
    const stmts = parser.parse_stmts(code)
    this.code_blocks.push(
      new CodeBlock({
        id: this.code_blocks.length,
        code,
        stmts,
      })
    )

    return this
  }

  get_code_block(id: number): CodeBlock | undefined {
    return this.code_blocks.find((code_block) => code_block.id === id)
  }

  update_code_block(id: number, code: string): void {
    const code_block = this.get_code_block(id)
    if (code_block) {
      code_block.updateCode(code)
    } else {
      console.warn(`I can not update non-existing code block of id: ${id}`)
    }
  }

  private async step(): Promise<Array<StmtOutput>> {
    const outputs = []

    const backup = { env: this.env, ctx: this.ctx }

    const { stmts } = this.code_blocks[this.counter]
    for (const stmt of stmts) {
      const output = await stmt.execute(this)
      if (output) {
        outputs.push(output)
      }
    }

    this.code_blocks[this.counter].outputs = outputs
    this.backups.push(backup)
    return outputs
  }

  async rerun_with(opts: {
    id: number
    code: string
  }): Promise<Array<StmtOutput>> {
    const { id, code } = opts

    const index = this.code_blocks.findIndex(
      (code_block) => code_block.id === id
    )

    if (index === -1) {
      throw new Error(`I can not find code block with id: ${id}`)
    }

    if (index < this.counter) {
      const backup = this.backups[index]
      this.env = backup.env
      this.ctx = backup.ctx
      this.backups = this.backups.slice(0, index)
      for (const [i, code_block] of this.code_blocks.entries()) {
        if (i >= index) {
          code_block.outputs = []
        }
      }
    }

    for (const code_block of this.code_blocks.slice(this.counter)) {
      if (code_block.id === id) {
        code_block.updateCode(code)
        return await this.step()
      } else {
        await this.step()
      }
    }

    throw new Error(`I can not find code block with id: ${id}`)
  }

  async run_to_the_end(): Promise<Array<StmtOutput>> {
    const outputs = []
    while (this.counter < this.code_blocks.length) {
      outputs.push(...(await this.step()))
    }

    return outputs
  }

  get all_output(): string {
    let s = ""
    for (const { outputs } of this.code_blocks) {
      for (const output of outputs) {
        s += output.repr()
        s += "\n"
      }
    }

    return s.trim() ? s : ""
  }
}
