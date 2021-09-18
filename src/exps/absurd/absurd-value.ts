import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { Solution } from "../../solution"
import * as Exps from "../../exps"

export class AbsurdValue extends Value {
  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Exps.TypeValue) {
      return new Exps.AbsurdCore()
    }
  }

  unify(subst: Solution, that: Value): Solution {
    if (that instanceof Exps.AbsurdValue) {
      return subst
    } else {
      return Solution.failure
    }
  }
}
