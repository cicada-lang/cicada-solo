import { Ctx } from "../ctx"
import { Exp } from "../exp"
import { Value } from "../value"
import * as Neutral from "../neutral"

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
    return this.neutral.readback_neutral(ctx)
  }
}
