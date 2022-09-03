import { Core, evaluate } from "../../core"
import { Ctx } from "../../ctx"
import { check, Exp, ExpMeta, subst } from "../../exp"
import * as Exps from "../../exps"
import { Value } from "../../value"

export class The extends Exp {
  meta: ExpMeta
  t: Exp
  x: Exp

  constructor(t: Exp, x: Exp, meta: ExpMeta) {
    super()
    this.meta = meta
    this.t = t
    this.x = x
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.t.free_names(bound_names),
      ...this.x.free_names(bound_names),
    ])
  }

  subst(name: string, exp: Exp): The {
    return new The(
      subst(this.t, name, exp),
      subst(this.x, name, exp),
      this.meta,
    )
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const t_core = check(ctx, this.t, new Exps.TypeValue())
    const t = evaluate(ctx.toEnv(), t_core)
    const core = check(ctx, this.x, t)
    return { t, core }
  }

  format(): string {
    const t = this.t.format()
    const x = this.x.format()
    const args = [t, x].join(", ")

    return `the(${args})`
  }
}
