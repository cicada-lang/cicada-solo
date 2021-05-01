import { Neutral } from "../../neutral"
import { Normal } from "../../normal"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import * as Cores from "../../cores"

export class ReplaceNeutral implements Neutral {
  target: Neutral
  motive: Normal
  base: Normal

  constructor(target: Neutral, motive: Normal, base: Normal) {
    this.target = target
    this.motive = motive
    this.base = base
  }

  readback_neutral(ctx: Ctx): Core {
    return new Cores.Replace(
      this.target.readback_neutral(ctx),
      this.motive.readback_normal(ctx),
      this.base.readback_normal(ctx)
    )
  }
}
