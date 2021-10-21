import { Neutral } from "../../neutral"
import { Normal } from "../../normal"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Solution } from "../../solution"
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
      solution = this.target.unify(solution, that.target)
      solution = this.motive.unify(solution, that.motive)
      solution = this.base.unify(solution, that.base)
      solution = this.step.unify(solution, that.step)
      return solution
    } else {
      return Solution.failure
    }
  }
}