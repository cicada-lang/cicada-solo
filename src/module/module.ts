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

  private end_p(): boolean {
    return this.index === this.code_blocks.length
  }

  async step(): Promise<void> {
    const { stmts } = this.code_blocks[this.index]
    for (const stmt of stmts) {
      await stmt.execute(this)
    }

    this.index++
  }

  async run(): Promise<Array<StmtOutput>> {
    const outputs = []
    while (!this.end_p()) {
      await this.step()
      const code_block = this.code_blocks[this.index - 1]
      if (code_block && code_block.outputs) {
        outputs.push(...code_block.outputs)
      }
    }

    return outputs
  }

  output(output: StmtOutput): void {
    this.code_blocks[this.index].outputs.push(output)
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
