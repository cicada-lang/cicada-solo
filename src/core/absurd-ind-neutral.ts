import { Neutral } from "../neutral"
import { Normal } from "../normal"
import { Exp } from "../exp"
import { Ctx } from "../ctx"
import { AbsurdInd } from "../core"
import { readback_neutral } from "../readback"

export class AbsurdIndNeutral {
  kind: "Neutral.absurd_ind" = "Neutral.absurd_ind"
  target: Neutral
  motive: Normal

  constructor(target: Neutral, motive: Normal) {
    this.target = target
    this.motive = motive
  }

  readback_neutral(ctx: Ctx): Exp {
    return new AbsurdInd(
      readback_neutral(ctx, this.target),
      this.motive.readback_normal(ctx)
    )
  }
}
