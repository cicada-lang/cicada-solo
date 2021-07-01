import { Neutral } from "../../neutral"
import { Normal } from "../../normal"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import * as Cores from "../../cores"

export class AbsurdIndNeutral extends Neutral {
  target: Neutral
  motive: Normal

  constructor(target: Neutral, motive: Normal) {
    super()
    this.target = target
    this.motive = motive
  }

  readback_neutral(ctx: Ctx): Core {
    return new Cores.AbsurdInd(
      this.target.readback_neutral(ctx),
      this.motive.readback_normal(ctx)
    )
  }
}
