import { Core } from "../../core"
import { Ctx } from "../../ctx"
import * as Exps from "../../exps"
import { Neutral } from "../../neutral"
import { Normal } from "../../normal"
import { Solution } from "../../solution"

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

  unify_neutral(solution: Solution, ctx: Ctx, that: Neutral): Solution {
    if (!(that instanceof VectorIndNeutral)) {
      return Solution.failure
    }

    return solution
      .unify_normal(ctx, this.length, that.length)
      .unify_neutral(ctx, this.target, that.target)
      .unify_normal(ctx, this.motive, that.motive)
      .unify_normal(ctx, this.base, that.base)
      .unify_normal(ctx, this.step, that.step)
  }
}
