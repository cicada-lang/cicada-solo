import { Ctx } from "../ctx"
import { Core } from "../core"
import { Value } from "../value"
import { Neutral } from "../neutral"
import { Solution } from "../solution"
import * as Exps from "../exps"

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

  unify(solution: Solution, that: Value): Solution {
    if (that instanceof NotYetValue) {
      return solution
        .unify(this.t, that.t)
        .unify_neutral(this.neutral, that.neutral)
    } else {
      return Solution.failure
    }
  }

  deep_walk(ctx: Ctx, solution: Solution): Value {
    return solution.walk(this)
  }
}
