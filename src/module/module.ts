import { Book } from "../book"
import { Stmt, StmtOutput } from "../stmt"
import { Env } from "../env"
import { Ctx } from "../ctx"
import { Parser } from "../parser"

// NOTE
// - A module belongs to a book.
// - Loaded modules are cached.
// - The loading order matters.
// - Recursion is not an option.

// NOTE top-level syntax of `Module` is statement-oriented

interface ModuleEntry {
  stmt: Stmt
  output?: StmtOutput
}

export class Module {
  book: Book
  path: string
  entries: Array<ModuleEntry>
  index: number = 0
  env: Env = Env.empty
  ctx: Ctx = Ctx.empty

  constructor(opts: { book: Book; path: string; stmts: Array<Stmt> }) {
    this.book = opts.book
    this.path = opts.path
    this.entries = opts.stmts.map((stmt) => ({ stmt }))
  }

  get stmts(): Array<Stmt> {
    return this.entries.map((entry) => entry.stmt)
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
