import { Exp, subst } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { evaluate } from "../../core"
import { check } from "../../exp"
import { Value } from "../../value"
import { Solution } from "../../solution"
import * as Exps from "../../exps"

export class Equal extends Exp {
  t: Exp
  from: Exp
  to: Exp

  constructor(t: Exp, from: Exp, to: Exp) {
    super()
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
      subst(this.to, name, exp)
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

  repr(): string {
    return `Equal(${this.t.repr()}, ${this.from.repr()}, ${this.to.repr()})`
  }
}
