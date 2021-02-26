import { Neutral } from "../neutral"
import { Normal } from "../normal"
import { Exp } from "../exp"
import { Ctx } from "../ctx"
import { Replace } from "../core"

export class ReplaceNeutral {
  kind: "Neutral.replace" = "Neutral.replace"
  target: Neutral
  motive: Normal
  base: Normal

  constructor(target: Neutral, motive: Normal, base: Normal) {
    this.target = target
    this.motive = motive
    this.base = base
  }

  readback_neutral(ctx: Ctx): Exp {
    return new Replace(
      this.target.readback_neutral(ctx),
      this.motive.readback_normal(ctx),
      this.base.readback_normal(ctx)
    )
  }
}
