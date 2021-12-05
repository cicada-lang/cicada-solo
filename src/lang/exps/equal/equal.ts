import { Core, evaluate } from "../../core"
import { Ctx } from "../../ctx"
import { check, Exp, ExpMeta, subst } from "../../exp"
import * as Exps from "../../exps"
import { Value } from "../../value"

export class Equal extends Exp {
  meta: ExpMeta
  t: Exp
  from: Exp
  to: Exp

  constructor(t: Exp, from: Exp, to: Exp, meta: ExpMeta) {
    super()
    this.meta = meta
    this.t = t
    this.from = from
    this.to = to
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.t.free_names(bound_names),
      ...this.from.free_names(bound_names),
      ...this.to.free_names(bound_names),
    ])
  }

  subst(name: string, exp: Exp): Exp {
    return new Equal(
      subst(this.t, name, exp),
      subst(this.from, name, exp),
      subst(this.to, name, exp),
      this.meta
    )
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const t_core = check(ctx, this.t, new Exps.TypeValue())
    const t_value = evaluate(ctx.to_env(), t_core)
    const from_core = check(ctx, this.from, t_value)
    const to_core = check(ctx, this.to, t_value)

    return {
      t: new Exps.TypeValue(),
      core: new Exps.EqualCore(t_core, from_core, to_core),
    }
  }

  format(): string {
    return `Equal(${this.t.format()}, ${this.from.format()}, ${this.to.format()})`
  }
}
