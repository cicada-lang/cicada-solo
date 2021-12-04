import { Exp, ExpMeta, subst } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { expect } from "../../value"
import { check_conversion } from "../../value"
import * as Exps from ".."

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
