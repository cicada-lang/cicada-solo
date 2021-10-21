import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { readback } from "../../value"
import * as Exps from "../../exps"

export class InrValue extends Value {
  right: Value

  constructor(right: Value) {
    super()
    this.right = right
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Exps.EitherValue) {
      return new Exps.InrCore(readback(ctx, t.right_t, this.right))
    }
  }

  unify(solution: Solution, that: Value): Solution {
    if (that instanceof Exps.InrValue) {
      return solution.unify(this.right, that.right)
    } else {
      return Solution.failure
    }
  }
}
