import { Neutral } from "../neutral"
import { Normal } from "../normal"
import { Exp } from "../exp"
import { Ctx } from "../ctx"
import { Ap } from "../core"

export class ApNeutral {
  kind: "Neutral.ap" = "Neutral.ap"
  target: Neutral
  arg: Normal

  constructor(target: Neutral, arg: Normal) {
    this.target = target
    this.arg = arg
  }

  readback_neutral(ctx: Ctx): Exp {
    return new Ap(
      this.target.readback_neutral(ctx),
      this.arg.readback_normal(ctx)
    )
  }
}
