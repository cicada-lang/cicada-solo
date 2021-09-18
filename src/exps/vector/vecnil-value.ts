import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { Solution } from "../../solution"
import * as Exps from "../../exps"

export class VecnilValue extends Value {
  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Exps.VectorValue) {
      return new Exps.VecnilCore()
    }
  }

  unify(subst: Solution, that: Value): Solution {
    if (that instanceof Exps.VecnilValue) {
      return subst
    } else {
      return Solution.failure
    }
  }
}
