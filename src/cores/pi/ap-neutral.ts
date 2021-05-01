import { Neutral } from "../../neutral"
import { Normal } from "../../normal"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import * as Cores from "../../cores"

export class ApNeutral implements Neutral {
  target: Neutral
  arg: Normal

  constructor(target: Neutral, arg: Normal) {
    this.target = target
    this.arg = arg
  }

  readback_neutral(ctx: Ctx): Core {
    return new Cores.Ap(
      this.target.readback_neutral(ctx),
      this.arg.readback_normal(ctx)
    )
  }
}
