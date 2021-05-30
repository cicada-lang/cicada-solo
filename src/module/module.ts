import { Library } from "../library"
import { Stmt } from "../stmt"
import { Env } from "../env"
import { Ctx } from "../ctx"

// NOTE
// - a module knows which library it belongs to
// - one file one module, loaded modules are cached
// - the loading order of files matters
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
  env: Env
  ctx: Ctx
  entries: Array<ModuleEntry>
  library: Library

  constructor(opts: {
    library: Library
    env?: Env
    ctx?: Ctx
    entries?: Array<ModuleEntry>
  }) {
    this.library = opts.library
    this.env = opts.env || new Env()
    this.ctx = opts.ctx || new Ctx()
    this.entries = opts.entries || []
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
