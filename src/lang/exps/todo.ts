import { Core } from "../core"
import { Ctx } from "../ctx"
import { Exp, ExpMeta } from "../exp"
import * as Exps from "../exps"
import { readback, Value } from "../value"

export class Todo extends Exp {
  meta: ExpMeta

  constructor(meta: ExpMeta) {
    super()
    this.meta = meta
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set()
  }

  subst(name: string, exp: Exp): this {
    return this
  }

  format(): string {
    return `TODO`
  }

  check(ctx: Ctx, t: Value): Core {
    const t_core = readback(ctx, new Exps.TypeValue(), t)
    const t_format = ctx.highlight("code", t_core.format())
    const head = ctx.highlight("warn", "TODO")
    ctx.todo(`${head}\n  ${t_format}`)
    return new Exps.TodoCore(t)
  }
}
