import { Core } from "../../core"
import { Ctx } from "../../ctx"
import * as Exps from "../../exps"
import { Solution } from "../../solution"
import { expect, readback, Value } from "../../value"

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

  unify(solution: Solution, ctx: Ctx, t: Value, that: Value): Solution {
    if (!(that instanceof Exps.InrValue)) {
      return Solution.failure
    }

    const either = expect(ctx, t, Exps.EitherValue)
    return solution.unify(ctx, either.right_t, this.right, that.right)
  }
}
