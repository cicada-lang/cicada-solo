import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { expect } from "../../value"
import { check_conversion } from "../../value"
import * as Exps from "../../exps"

export class Same extends Exp {
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
    return new Exps.SameCore()
  }

  repr(): string {
    return "same"
  }
}
