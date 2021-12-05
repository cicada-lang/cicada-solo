import { Core } from "../../core"
import { Ctx } from "../../ctx"
import * as Exps from "../../exps"
import { Neutral } from "../../neutral"
import { Solution } from "../../solution"

export class CdrNeutral extends Neutral {
  target: Neutral

  constructor(target: Neutral) {
    super()
    this.target = target
  }

  readback_neutral(ctx: Ctx): Core {
    return new Exps.CdrCore(this.target.readback_neutral(ctx))
  }

  unify_neutral(solution: Solution, ctx: Ctx, that: Neutral): Solution {
    if (!(that instanceof CdrNeutral)) {
      return Solution.failure
    }

    return solution.unify_neutral(ctx, this.target, that.target)
  }
}
