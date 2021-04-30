import { Neutral } from "../../neutral"
import { Normal } from "../../normal"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { AbsurdInd } from "../../cores"

export class AbsurdIndNeutral implements Neutral {
  target: Neutral
  motive: Normal

  constructor(target: Neutral, motive: Normal) {
    this.target = target
    this.motive = motive
  }

  readback_neutral(ctx: Ctx): Core {
    return new AbsurdInd(
      this.target.readback_neutral(ctx),
      this.motive.readback_normal(ctx)
    )
  }
}
