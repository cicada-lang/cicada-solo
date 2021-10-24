import { Neutral } from "../../neutral"
import { Solution } from "../../solution"
import { Normal } from "../../normal"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import * as Exps from "../../exps"

export class VectorIndNeutral extends Neutral {
  length: Normal
  target: Neutral
  motive: Normal
  base: Normal
  step: Normal

  constructor(
    length: Normal,
    target: Neutral,
    motive: Normal,
    base: Normal,
    step: Normal
  ) {
    super()
    this.length = length
    this.target = target
    this.motive = motive
    this.base = base
    this.step = step
  }

  readback_neutral(ctx: Ctx): Core {
    return new Exps.VectorIndCore(
      this.length.readback_normal(ctx),
      this.target.readback_neutral(ctx),
      this.motive.readback_normal(ctx),
      this.base.readback_normal(ctx),
      this.step.readback_normal(ctx)
    )
  }

  unify(solution: Solution, that: Neutral): Solution {
    if (that instanceof VectorIndNeutral) {
      return solution
        .unify_normal(this.length, that.length)
        .unify_neutral(this.target, that.target)
        .unify_normal(this.motive, that.motive)
        .unify_normal(this.base, that.base)
        .unify_normal(this.step, that.step)
    } else {
      return Solution.failure
    }
  }
}
