import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { Solution } from "../../solution"
import * as Exps from "../../exps"

export class ZeroValue extends Value {
  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Exps.NatValue) {
      return new Exps.ZeroCore()
    }
  }

  unify(subst: Solution, that: Value): Solution {
    if (that instanceof Exps.ZeroValue) {
      return subst
    } else {
      return Solution.failure
    }
  }
}
