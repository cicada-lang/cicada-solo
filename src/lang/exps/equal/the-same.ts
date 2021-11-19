import { Exp, ExpMeta, ElaborationOptions, subst } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { check } from "../../exp"
import { evaluate } from "../../core"
import { expect } from "../../value"
import { check_conversion } from "../../value"
import * as Exps from ".."

export class TheSame extends Exp {
  meta: ExpMeta
  t: Exp
  exp: Exp

  constructor(t: Exp, exp: Exp, meta: ExpMeta) {
    super()
    this.meta = meta
    this.t = t
    this.exp = exp
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.t.free_names(bound_names),
      ...this.exp.free_names(bound_names),
    ])
  }

  subst(name: string, exp: Exp): Exp {
    return new TheSame(
      subst(this.t, name, exp),
      subst(this.exp, name, exp),
      this.meta
    )
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const t_core = check(ctx, this.t, new Exps.TypeValue())
    const t = evaluate(ctx.to_env(), t_core)

    const core = check(ctx, this.exp, t)
    const value = evaluate(ctx.to_env(), core)

    return {
      t: new Exps.EqualValue(t, value, value),
      core: new Exps.ReflCore(),
    }
  }

  format(): string {
    return `the_same(${this.t.format()}, ${this.exp.format()})`
  }
}
