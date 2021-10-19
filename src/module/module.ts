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
  counter: number = 0
  env: Env
  ctx: Ctx

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

  append_code_block(text: string): this {
    const parser = new Parser()
    const stmts = parser.parse_stmts(text)
    this.code_blocks.push(
      new CodeBlock({
        index: this.code_blocks.length,
        code: text,
        stmts,
      })
    )

    return this
  }

  async step(): Promise<Array<StmtOutput>> {
    const outputs = []
    const { stmts } = this.code_blocks[this.counter]
    for (const stmt of stmts) {
      const output = await stmt.execute(this)
      if (output) {
        outputs.push(output)
      }
    }

    this.code_blocks[this.counter].outputs = outputs
    this.counter++
    return outputs
  }

  async run_to(index: number): Promise<Array<StmtOutput>> {
    // NOTE The `index` can NOT be used to index `this.code_blocks`,
    //   `counter` is used to index `this.code_blocks`.
    const outputs = []
    for (const code_block of this.code_blocks) {
      outputs.push(...(await this.step()))
      if (code_block.index === index) {
        break
      }
    }

    return outputs
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

  // NOTE The index is not index into the array `this.code_blocks`,
  //   but the `index` in the `code_block`.
  get_code_block(index: number): CodeBlock | undefined {
    return this.code_blocks.find((code_block) => code_block.index === index)
  }
}
