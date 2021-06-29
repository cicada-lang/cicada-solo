import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { expect } from "../../expect"
import { readback } from "../../readback"
import { check_conversion } from "../../conversion"
import { Trace } from "../../errors"
import * as ut from "../../ut"
import * as Cores from "../../cores"

export class Same extends Exp {
  free_names(bound_names: Set<string>): Set<string> {
    return new Set()
  }

  subst(name: string, exp: Exp): Exp {
    return this
  }

  check(ctx: Ctx, t: Value): Core {
    const equal = expect(ctx, t, Cores.EqualValue)
    check_conversion(ctx, equal.t, equal.from, equal.to, {
      description: {
        from: "left hand side",
        to: "right hand side",
      },
    })
    return new Cores.Same()
  }

  repr(): string {
    return "same"
  }
}
