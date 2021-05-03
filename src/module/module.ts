import { Library } from "../library"
import { Env } from "../env"
import { Ctx } from "../ctx"

// NOTE
// - a module knows which library it belongs to
// - one file one module, loaded modules are cached
// - the loading order of files matters
// - no recursion

export class Module {
  env: Env
  ctx: Ctx
  output: string
  library: Library

  constructor(opts: {
    library: Library
    env?: Env
    ctx?: Ctx
    output?: string
  }) {
    this.library = opts.library
    this.env = opts.env || new Env()
    this.ctx = opts.ctx || new Ctx()
    this.output = opts.output || ""
  }
}
