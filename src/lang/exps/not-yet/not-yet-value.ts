import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Neutral } from "../../neutral"
import { Solution } from "../../solution"
import { Value } from "../../value"

export class NotYetValue extends Value {
  t: Value
  neutral: Neutral

  constructor(t: Value, neutral: Neutral) {
    super()
    this.t = t
    this.neutral = neutral
  }

  readback(ctx: Ctx, t: Value): Core {
    // NOTE  t and this.t are ignored here,
    //  maybe use them to debug.
    return this.neutral.readback_neutral(ctx)
  }

  unify(solution: Solution, ctx: Ctx, t: Value, that: Value): Solution {
    if (!(that instanceof NotYetValue)) {
      return Solution.fail_to_be_the_same_value(ctx, t, this, that)
    }

    return solution
      .unify_type(ctx, this.t, that.t)
      .unify_neutral(ctx, this.neutral, that.neutral)
  }

  deep_walk(ctx: Ctx, solution: Solution): Value {
    return solution.walk(this)
  }
}
