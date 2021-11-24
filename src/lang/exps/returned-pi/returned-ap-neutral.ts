import { Neutral } from "../../neutral"
import { Solution } from "../../solution"
import { Normal } from "../../normal"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import * as Exps from ".."

export class ReturnedApNeutral extends Neutral {
  target: Neutral
  arg: Normal

  constructor(target: Neutral, arg: Normal) {
    super()
    this.target = target
    this.arg = arg
  }

  readback_neutral(ctx: Ctx): Core {
    return new Exps.ReturnedApCore(
      this.target.readback_neutral(ctx),
      this.arg.readback_normal(ctx)
    )
  }

  unify(ctx: Ctx, solution: Solution, that: Neutral): Solution {
    if (!(that instanceof ReturnedApNeutral)) {
      return Solution.failure
    }

    return solution
      .unify_neutral(ctx, this.target, that.target)
      .unify_normal(ctx, this.arg, that.arg)
  }
}
