import { Neutral } from "../../neutral"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import * as Exps from "../../exps"

export class CdrNeutral extends Neutral {
  target: Neutral

  constructor(target: Neutral) {
    super()
    this.target = target
  }

  readback_neutral(ctx: Ctx): Core {
    return new Exps.CdrCore(this.target.readback_neutral(ctx))
  }
}
