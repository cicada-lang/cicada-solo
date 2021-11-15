import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { Solution } from "../../solution"
import * as Exps from "../../exps"

export class ReflValue extends Value {
  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Exps.EqualValue) {
      return new Exps.ReflCore()
    }
  }

  unify(solution: Solution, ctx: Ctx, t: Value, that: Value): Solution {
    if (that instanceof Exps.ReflValue) {
      return solution
    } else {
      return Solution.failure
    }
  }
}
