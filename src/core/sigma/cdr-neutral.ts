import { Neutral } from "../../neutral"
import { Exp } from "../../exp"
import { Ctx } from "../../ctx"
import { Cdr } from "../../core"

export class CdrNeutral implements Neutral {
  target: Neutral

  constructor(target: Neutral) {
    this.target = target
  }

  readback_neutral(ctx: Ctx): Exp {
    return new Cdr(this.target.readback_neutral(ctx))
  }
}
