import { Neutral } from "../../neutral"
import { Solution } from "../../solution"
import { Normal } from "../../normal"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import * as Exps from "../../exps"

export class EitherIndNeutral extends Neutral {
  target: Neutral
  motive: Normal
  base_left: Normal
  base_right: Normal

  constructor(
    target: Neutral,
    motive: Normal,
    base_left: Normal,
    base_right: Normal
  ) {
    super()
    this.target = target
    this.motive = motive
    this.base_left = base_left
    this.base_right = base_right
  }

  readback_neutral(ctx: Ctx): Core {
    return new Exps.EitherIndCore(
      this.target.readback_neutral(ctx),
      this.motive.readback_normal(ctx),
      this.base_left.readback_normal(ctx),
      this.base_right.readback_normal(ctx)
    )
  }
}
