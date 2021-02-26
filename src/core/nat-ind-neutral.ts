import { Neutral } from "../neutral"
import { Normal } from "../normal"
import { Exp } from "../exp"
import { Ctx } from "../ctx"
import { NatInd } from "../core"

export class NatIndNeutral {
  kind: "Neutral.nat_ind" = "Neutral.nat_ind"
  target: Neutral
  motive: Normal
  base: Normal
  step: Normal

  constructor(target: Neutral, motive: Normal, base: Normal, step: Normal) {
    this.target = target
    this.motive = motive
    this.base = base
    this.step = step
  }

  readback_neutral(ctx: Ctx): Exp {
    return new NatInd(
      this.target.readback_neutral(ctx),
      this.motive.readback_normal(ctx),
      this.base.readback_normal(ctx),
      this.step.readback_normal(ctx)
    )
  }
}
