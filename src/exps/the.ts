import { Exp, substitute } from "../exp"
import { Core } from "../core"
import { Ctx } from "../ctx"
import { Value } from "../value"
import { evaluate } from "../core"
import { check } from "../exp"
import * as Exps from "../exps"

export class The extends Exp {
  t: Exp
  exp: Exp

  constructor(t: Exp, exp: Exp) {
    super()
    this.t = t
    this.exp = exp
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.t.free_names(bound_names),
      ...this.exp.free_names(bound_names),
    ])
  }

  substitute(name: string, exp: Exp): The {
    return new The(
      substitute(this.t, name, exp),
      substitute(this.exp, name, exp)
    )
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const t_core = check(ctx, this.t, new Exps.TypeValue())
    const t = evaluate(ctx.to_env(), t_core)
    const core = check(ctx, this.exp, t)
    return { t, core }
  }

  repr(): string {
    const args = [this.t.repr(), this.exp.repr()].join(", ")
    return `the(${args})`
  }
}
