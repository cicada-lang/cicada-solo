import { Book } from "../book"
import { Stmt, StmtOutput } from "../stmt"
import { Env } from "../env"
import { Ctx } from "../ctx"
import { Parser } from "../parser"
import { CodeBlock } from "./code-block"

// NOTE
// - A module belongs to a book.
// - A module is statement-oriented,
//   instead of expression-oriented.
// - Loaded modules are cached.
// - The loading order of statements matters.
// - Recursion is not an option.

export class Module {
  book: Book
  path: string
  code_blocks: Array<CodeBlock>
  index: number = 0
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
    this.code_blocks.push({
      index: this.code_blocks.length,
      text,
      stmts,
      outputs: [],
    })

    return this
  }

  async step(): Promise<Array<StmtOutput>> {
    const outputs = []
    const { stmts } = this.code_blocks[this.index]
    for (const stmt of stmts) {
      const output = await stmt.execute(this)
      if (output) {
        outputs.push(output)
      }
    }

    this.code_blocks[this.index].outputs = outputs
    this.index++
    return outputs
  }

  private end_p(): boolean {
    return this.index === this.code_blocks.length
  }

  async run(): Promise<Array<StmtOutput>> {
    const outputs = []
    while (!this.end_p()) {
      outputs.push(...(await this.step()))
    }

    return outputs
  }

  get all_output(): string {
    let s = ""
    for (const { outputs } of this.code_blocks) {
      for (const output of outputs) {
        if (output) {
          s += output.repr()
          s += "\n"
        }
      }
    }

    return s.trim() ? s : ""
  }
}
