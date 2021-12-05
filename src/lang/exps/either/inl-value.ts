import { Core } from "../../core"
import { Ctx } from "../../ctx"
import * as Exps from "../../exps"
import { Solution } from "../../solution"
import { expect, readback, Value } from "../../value"

export class InlValue extends Value {
  left: Value

  constructor(left: Value) {
    super()
    this.left = left
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Exps.EitherValue) {
      return new Exps.InlCore(readback(ctx, t.left_t, this.left))
    }
  }

  unify(solution: Solution, ctx: Ctx, t: Value, that: Value): Solution {
    if (!(that instanceof Exps.InlValue)) {
      return Solution.failure
    }

    const either = expect(ctx, t, Exps.EitherValue)
    return solution.unify(ctx, either.left_t, this.left, that.left)
  }
}
