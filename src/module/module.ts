import { Library } from "../library"
import { Stmt } from "../stmt"
import { Env } from "../env"
import { Ctx } from "../ctx"

// NOTE
// - a module belongs to a library
// - loaded modules are cached
// - the loading order matters
// - no recursion

class ModuleEntry {
  stmt: Stmt
  output: string

  constructor(opts: { stmt: Stmt; output: string }) {
    this.stmt = opts.stmt
    this.output = opts.output
  }
}

export class Module {
  library: Library
  path: string
  text: string
  stmts: Array<Stmt>
  env: Env = Env.empty
  ctx: Ctx = Ctx.empty
  entries: Array<ModuleEntry> = []

  constructor(opts: {
    library: Library
    path: string
    text: string
    stmts: Array<Stmt>
  }) {
    this.library = opts.library
    this.path = opts.path
    this.text = opts.text
    this.stmts = opts.stmts
  }

  async execute(): Promise<void> {
    for (const stmt of this.stmts) {
      await stmt.execute(this)
    }
  }

  enter(stmt: Stmt, opts?: { output?: string }): void {
    const output = opts?.output || ""
    this.entries.push(new ModuleEntry({ stmt, output }))
  }

  get output(): string {
    const output = this.entries
      .filter((entry) => entry.output)
      .map((entry) => entry.output)
      .join("\n")

    return output ? output + "\n" : ""
  }
}
