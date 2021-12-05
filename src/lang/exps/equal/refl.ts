import * as Exps from ".."
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Exp, ExpMeta } from "../../exp"
import { check_conversion, expect, Value } from "../../value"

export class Refl extends Exp {
  meta: ExpMeta

  constructor(meta: ExpMeta) {
    super()
    this.meta = meta
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set()
  }

  subst(name: string, exp: Exp): Exp {
    return this
  }

  check(ctx: Ctx, t: Value): Core {
    const equal = expect(ctx, t, Exps.EqualValue)
    check_conversion(ctx, equal.t, equal.from, equal.to, {
      description: {
        from: "left hand side",
        to: "right hand side",
      },
    })
    return new Exps.ReflCore()
  }

  format(): string {
    return "refl"
  }
}
