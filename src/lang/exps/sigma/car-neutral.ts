import { Core } from "../../core"
import { Ctx } from "../../ctx"
import * as Exps from "../../exps"
import { Neutral } from "../../neutral"
import { Solution } from "../../solution"

export class CarNeutral extends Neutral {
  target: Neutral

  constructor(target: Neutral) {
    super()
    this.target = target
  }

  readback_neutral(ctx: Ctx): Core {
    return new Exps.CarCore(this.target.readback_neutral(ctx))
  }

  unify_neutral(solution: Solution, ctx: Ctx, that: Neutral): Solution {
    if (!(that instanceof CarNeutral)) {
      return Solution.fail_to_be_the_same_neutral(ctx, this, that)
    }

    return solution.unify_neutral(ctx, this.target, that.target)
  }
}
