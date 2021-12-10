import { Core } from "../core"
import { Ctx } from "../ctx"
import * as Exps from "../exps"
import { Neutral } from "../neutral"
import { Solution } from "../solution"
import { Value } from "../value"

export class TodoNeutral extends Neutral {
  t: Value

  constructor(t: Value) {
    super()
    this.t = t
  }

  readback_neutral(ctx: Ctx): Core {
    return new Exps.TodoCore(this.t)
  }

  unify_neutral(solution: Solution, ctx: Ctx, that: Neutral): Solution {
    if (!(that instanceof TodoNeutral)) {
      return Solution.fail_to_be_the_same_neutral(ctx, this, that)
    }

    return solution.unify_type(ctx, this.t, that.t)
  }
}
