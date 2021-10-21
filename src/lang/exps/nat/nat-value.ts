import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { Solution } from "../../solution"
import * as Exps from "../../exps"

export class NatValue extends Value {
  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Exps.TypeValue) {
      return new Exps.NatCore()
    }
  }

  unify(solution: Solution, that: Value): Solution {
    if (that instanceof Exps.NatValue) {
      return solution
    } else {
      return Solution.failure
    }
  }
}
