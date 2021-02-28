import { Neutral } from "@/neutral"
import { Normal } from "@/normal"
import { Exp } from "@/exp"
import { Ctx } from "@/ctx"
import { AbsurdInd } from "@/core"

export class AbsurdIndNeutral {
  target: Neutral
  motive: Normal

  constructor(target: Neutral, motive: Normal) {
    this.target = target
    this.motive = motive
  }

  readback_neutral(ctx: Ctx): Exp {
    return new AbsurdInd(
      this.target.readback_neutral(ctx),
      this.motive.readback_normal(ctx)
    )
  }
}
