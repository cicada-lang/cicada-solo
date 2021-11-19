import { Exp, ExpMeta, ElaborationOptions, subst } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value, readback } from "../../value"
import { Solution } from "../../solution"
import * as Exps from "../../exps"

export class Quote extends Exp {
  meta: ExpMeta
  str: string

  constructor(str: string, meta: ExpMeta) {
    super()
    this.meta = meta
    this.str = str
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set()
  }

  subst(name: string, exp: Exp): this {
    return this
  }

  infer(ctx: Ctx, opts: ElaborationOptions): { t: Value; core: Core } {
    const t = new Exps.StrValue()
    const core = new Exps.QuoteCore(this.str)

    if (opts?.narrate_elaboration_p) {
      const t_core = readback(ctx, new Exps.TypeValue(), t)
      const t_format = ctx.highlight("code", t_core.format())
      const core_format = ctx.highlight("code", core.format())
      ctx.narration([
        `Given a doublequoted literal value ${core_format},`,
        `I can inter its type to be ${t_format},`,
        `and elaborate it to ${core_format}.`,
      ])
    }

    return { t, core }
  }

  format(): string {
    return `"${this.str}"`
  }
}
