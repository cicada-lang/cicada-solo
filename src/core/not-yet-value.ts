import { Ctx } from "../ctx"
import { Exp } from "../exp"
import { Value } from "../value"
import * as Neutral from "../neutral"
import * as Readback from "../readback"

export class NotYetValue {
  t: Value
  neutral: Neutral.Neutral

  constructor(t: Value, neutral: Neutral.Neutral) {
    this.t = t
    this.neutral = neutral
  }

  readback(ctx: Ctx, t: Value): Exp {
    // NOTE  t and value.t are ignored here,
    //  maybe use them to debug.
    return Readback.readback_neutral(ctx, this.neutral)
  }
}
