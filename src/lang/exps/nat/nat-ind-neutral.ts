import { Neutral } from "../../neutral"
import { Solution } from "../../solution"
import { Normal } from "../../normal"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import * as Exps from "../../exps"

export class NatIndNeutral extends Neutral {
  target: Neutral
  motive: Normal
  base: Normal
  step: Normal

  constructor(target: Neutral, motive: Normal, base: Normal, step: Normal) {
    super()
    this.target = target
    this.motive = motive
    this.base = base
    this.step = step
  }

  readback_neutral(ctx: Ctx): Core {
    return new Exps.NatIndCore(
      this.target.readback_neutral(ctx),
      this.motive.readback_normal(ctx),
      this.base.readback_normal(ctx),
      this.step.readback_normal(ctx)
    )
  }

  unify(solution: Solution, that: Neutral): Solution {
    if (that instanceof NatIndNeutral) {
      return solution
        .unify_neutral(this.target, that.target)
        .unify_normal(this.motive, that.motive)
        .unify_normal(this.base, that.base)
        .unify_normal(this.step, that.step)
    } else {
      return Solution.failure
    }
  }
}
