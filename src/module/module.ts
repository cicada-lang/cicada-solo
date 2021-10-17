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

interface ModuleEntry {
  stmt: Stmt
  output?: StmtOutput
}

export class Module {
  book: Book
  path: string
  private entries: Array<ModuleEntry>
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
    this.entries = opts.code_blocks.flatMap(({ stmts }) =>
      stmts.map((stmt) => ({ stmt }))
    )
    this.env = opts.env
    this.ctx = opts.ctx
  }

  append(text: string): this {
    const parser = new Parser()
    const stmts = parser.parse_stmts(text)
    this.entries.push(...stmts.map((stmt) => ({ stmt })))
    return this
  }

  end_p(): boolean {
    return this.index === this.entries.length
  }

  async step(): Promise<void> {
    const { stmt } = this.entries[this.index]
    await stmt.execute(this)
    this.index++
  }

  undo(index: number): void {
    this.index = index
    this.entries = this.entries.slice(0, index)
  }

  async run(): Promise<Array<StmtOutput>> {
    const outputs = []
    while (!this.end_p()) {
      await this.step()
      const entry = this.entries[this.index - 1]
      if (entry && entry.output) {
        outputs.push(entry.output)
      }
    }

    return outputs
  }

  output(output: StmtOutput): void {
    const entry = this.entries[this.index]
    entry.output = output
  }

  get all_output(): string {
    let s = ""
    for (const entry of this.entries) {
      if (entry.output) {
        s += entry.output.repr()
        s += "\n"
      }
    }

    return s.trim() ? s : ""
  }
}
