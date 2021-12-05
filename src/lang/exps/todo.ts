import { Core } from "../core"
import { Ctx } from "../ctx"
import { Exp, ExpMeta } from "../exp"
import * as Exps from "../exps"
import { readback, Value } from "../value"

export class Todo extends Exp {
  meta: ExpMeta
  note: string

  constructor(note: string, meta: ExpMeta) {
    super()
    this.meta = meta
    this.note = note
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set()
  }

  subst(name: string, exp: Exp): this {
    return this
  }

  format(): string {
    return `@TODO ${new Exps.QuoteCore(this.note).format()}`
  }

  check(ctx: Ctx, t: Value): Core {
    const t_core = readback(ctx, new Exps.TypeValue(), t)
    const t_format = ctx.highlight("code", t_core.format())
    const head = ctx.highlight("warn", "@TODO")
    const note = ctx.highlight("note", this.note)
    ctx.todo([
      //
      `${head} ${note}`,
      `  ${t_format}`,
    ])

    return new Exps.TodoCore(this.note, t)
  }
}
