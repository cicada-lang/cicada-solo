import { Neutral } from "../neutral"
import { Normal } from "../normal"
import { Exp } from "../exp"
import { Ctx } from "../ctx"
import { Cdr } from "../core"
import { readback_neutral } from "../readback"

export class CdrNeutral {
  kind: "Neutral.cdr" = "Neutral.cdr"
  target: Neutral

  constructor(target: Neutral) {
    this.target = target
  }

  readback_neutral(ctx: Ctx): Exp {
    return new Cdr(readback_neutral(ctx, this.target))
  }
}
