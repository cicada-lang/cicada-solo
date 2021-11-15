import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { expect, Value } from "../../value"
import { Solution } from "../../solution"
import { readback } from "../../value"
import * as Exps from "../../exps"

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
    if (that instanceof Exps.InlValue) {
      const either = expect(ctx, t, Exps.EitherValue)
      return solution.unify(ctx, either.left_t, this.left, that.left)
    } else {
      return Solution.failure
    }
  }
}
