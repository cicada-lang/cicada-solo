import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { Solution } from "../../solution"
import * as Exps from "../../exps"

export class SoleValue extends Value {
  readback(ctx: Ctx, t: Value): Core | undefined {
    return new Exps.SoleCore()
  }

  unify(solution: Solution, that: Value): Solution {
    if (that instanceof Exps.SoleValue) {
      return solution
    } else {
      return Solution.failure
    }
  }
}