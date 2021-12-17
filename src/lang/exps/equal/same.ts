import * as Exps from ".."
import { Core, evaluate } from "../../core"
import { Ctx } from "../../ctx"
import { check, Exp, ExpMeta, subst } from "../../exp"
import { check_conversion, expect, Value } from "../../value"

export class Same extends Exp {
  meta: ExpMeta
  exp: Exp

  constructor(exp: Exp, meta: ExpMeta) {
    super()
    this.meta = meta
    this.exp = exp
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([...this.exp.free_names(bound_names)])
  }

  subst(name: string, exp: Exp): Exp {
    return new Same(subst(this.exp, name, exp), this.meta)
  }

  check(ctx: Ctx, t: Value): Core {
    const equal = expect(ctx, t, Exps.EqualValue)

    check_conversion(ctx, equal.t, equal.from, equal.to, {
      description: {
        from: "left hand side of the Equal",
        to: "right hand side of the Equal",
      },
    })

    const core = check(ctx, this.exp, equal.t)
    const value = evaluate(ctx.to_env(), core)

    check_conversion(ctx, equal.t, value, equal.to, {
      description: {
        from: "specified value",
        to: "right hand side of the Equal",
      },
    })

    return new Exps.BuiltInCore("refl")
  }

  format(): string {
    return `same(${this.exp.format()})`
  }
}
