import { Neutral } from "../../neutral"
import { Normal } from "../../normal"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import * as Cores from "../../cores"

export class VectorIndNeutral implements Neutral {
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
    this.length = length
    this.target = target
    this.motive = motive
    this.base = base
    this.step = step
  }

  readback_neutral(ctx: Ctx): Core {
    return new Cores.VectorInd(
      this.length.readback_normal(ctx),
      this.target.readback_neutral(ctx),
      this.motive.readback_normal(ctx),
      this.base.readback_normal(ctx),
      this.step.readback_normal(ctx)
    )
  }
}
