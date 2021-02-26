import { Neutral } from "../neutral"
import { Normal } from "../normal"
import { Exp } from "../exp"
import { Ctx } from "../ctx"
import { Ap } from "../core"
import { readback_neutral } from "../readback"

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
      readback_neutral(ctx, this.target),
      this.arg.readback_normal(ctx)
    )
  }
}
