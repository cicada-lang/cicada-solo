import { Neutral } from "../../neutral"
import { Normal } from "../../normal"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import * as Sem from "../../sem"

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
    return new Sem.NatIndCore(
      this.target.readback_neutral(ctx),
      this.motive.readback_normal(ctx),
      this.base.readback_normal(ctx),
      this.step.readback_normal(ctx)
    )
  }
}
