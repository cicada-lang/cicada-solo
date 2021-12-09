import { Core } from "../../core"
import { Ctx } from "../../ctx"
import * as Exps from "../../exps"
import { Neutral } from "../../neutral"
import { Normal } from "../../normal"
import { Solution } from "../../solution"

export class ReplaceNeutral extends Neutral {
  target: Neutral
  motive: Normal
  base: Normal

  constructor(target: Neutral, motive: Normal, base: Normal) {
    super()
    this.target = target
    this.motive = motive
    this.base = base
  }

  readback_neutral(ctx: Ctx): Core {
    return new Exps.ReplaceCore(
      this.target.readback_neutral(ctx),
      this.motive.readback_normal(ctx),
      this.base.readback_normal(ctx)
    )
  }

  unify_neutral(solution: Solution, ctx: Ctx, that: Neutral): Solution {
    if (!(that instanceof ReplaceNeutral)) {
      return Solution.fail_to_be_the_same_neutral(ctx, this, that)
    }

    return solution
      .unify_neutral(ctx, this.target, that.target)
      .unify_normal(ctx, this.motive, that.motive)
      .unify_normal(ctx, this.base, that.base)
  }
}
