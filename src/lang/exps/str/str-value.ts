import { Core } from "../../core"
import { Ctx } from "../../ctx"
import * as Exps from "../../exps"
import { Solution } from "../../solution"
import { Value } from "../../value"

export class StrValue extends Value {
  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Exps.TypeValue) {
      return new Exps.StrCore()
    }
  }

  unify(solution: Solution, ctx: Ctx, t: Value, that: Value): Solution {
    if (!(that instanceof Exps.StrValue)) {
      return Solution.fail_to_be_the_same_value(ctx, t, this, that)
    }

    return solution
  }
}
