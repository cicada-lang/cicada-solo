import { Neutral } from "../../neutral"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import * as Sem from "../../sem"

export class CdrNeutral extends Neutral {
  target: Neutral

  constructor(target: Neutral) {
    super()
    this.target = target
  }

  readback_neutral(ctx: Ctx): Core {
    return new Sem.Cdr(this.target.readback_neutral(ctx))
  }
}
