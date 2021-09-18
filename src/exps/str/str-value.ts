import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { Solution } from "../../solution"
import * as Exps from "../../exps"

export class StrValue extends Value {
  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Exps.TypeValue) {
      return new Exps.StrCore()
    }
  }

  unify(subst: Solution, that: Value): Solution {
    if (that instanceof Exps.StrValue) {
      return subst
    } else {
      return Solution.failure
    }
  }
}
