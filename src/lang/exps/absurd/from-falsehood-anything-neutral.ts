import * as Exps from ".."
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Neutral } from "../../neutral"
import { Normal } from "../../normal"
import { Solution } from "../../solution"

export class FromFalsehoodAnythingNeutral extends Neutral {
  target: Neutral
  motive: Normal

  constructor(target: Neutral, motive: Normal) {
    super()
    this.target = target
    this.motive = motive
  }

  readback_neutral(ctx: Ctx): Core {
    return new Exps.FromFalsehoodAnythingCore(
      this.target.readback_neutral(ctx),
      this.motive.readback_normal(ctx)
    )
  }

  unify_neutral(solution: Solution, ctx: Ctx, that: Neutral): Solution {
    if (!(that instanceof FromFalsehoodAnythingNeutral)) {
      return Solution.fail_to_be_the_same_neutral(ctx, this, that)
    }

    return solution
      .unify_neutral(ctx, this.target, that.target)
      .unify_normal(ctx, this.motive, that.motive)
  }
}
