import { Library } from "../library"
import { Stmt } from "../stmt"
import { Env } from "../env"
import { Ctx } from "../ctx"
import * as Syntax from "../syntax"

// NOTE
// - A module belongs to a library.
// - Loaded modules are cached.
// - The loading order matters.
// - Recursion is not an option.

// NOTE top-level syntax of `Module` is statement-oriented

interface ModuleEntry {
  stmt: Stmt
  output?: string
}

export class Module {
  library: Library
  path: string
  entries: Array<ModuleEntry>
  index: number = 0
  env: Env = Env.empty
  ctx: Ctx = Ctx.empty

  constructor(opts: { library: Library; path: string; stmts: Array<Stmt> }) {
    this.library = opts.library
    this.path = opts.path
    this.entries = opts.stmts.map((stmt) => ({ stmt }))
  }

  get stmts(): Array<Stmt> {
    return this.entries.map((entry) => entry.stmt)
  }

  append(text: string): this {
    const stmts = Syntax.parse_stmts(text)
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

  async run(): Promise<string> {
    let s = ""
    while (!this.end_p()) {
      await this.step()
      const entry = this.entries[this.index - 1]

      if (entry && entry.output) {
        s += entry.output + "\n"
      }
    }

    return s
  }

  output(output: string): void {
    const entry = this.entries[this.index]
    entry.output = output
  }

  get all_output(): string {
    const output = this.entries
      .filter((entry) => entry.output)
      .map((entry) => entry.output)
      .join("\n")

    return output ? output + "\n" : ""
  }
}
