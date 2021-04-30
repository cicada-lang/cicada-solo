import { Neutral } from "../../neutral"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Cdr } from "../../cores"

export class CdrNeutral implements Neutral {
  target: Neutral

  constructor(target: Neutral) {
    this.target = target
  }

  readback_neutral(ctx: Ctx): Core {
    return new Cdr(this.target.readback_neutral(ctx))
  }
}
