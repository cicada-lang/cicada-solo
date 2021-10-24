import { Neutral } from "../../neutral"
import { Solution } from "../../solution"
import { Normal } from "../../normal"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import * as Exps from "../../exps"

export class AbsurdIndNeutral extends Neutral {
  target: Neutral
  motive: Normal

  constructor(target: Neutral, motive: Normal) {
    super()
    this.target = target
    this.motive = motive
  }

  readback_neutral(ctx: Ctx): Core {
    return new Exps.AbsurdIndCore(
      this.target.readback_neutral(ctx),
      this.motive.readback_normal(ctx)
    )
  }
}
