import { Neutral } from "../../neutral"
import { Normal } from "../../normal"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import * as Exps from "../../exps"

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
}
