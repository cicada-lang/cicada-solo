import { Neutral } from "../../neutral"
import { Solution } from "../../solution"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import * as Exps from "../../exps"

export class VectorHeadNeutral extends Neutral {
  target: Neutral

  constructor(target: Neutral) {
    super()
    this.target = target
  }

  readback_neutral(ctx: Ctx): Core {
    return new Exps.VectorHeadCore(this.target.readback_neutral(ctx))
  }

  unify(ctx: Ctx, solution: Solution, that: Neutral): Solution {
    if (that instanceof VectorHeadNeutral) {
      return solution.unify_neutral(ctx, this.target, that.target)
    } else {
      return Solution.failure
    }
  }
}
