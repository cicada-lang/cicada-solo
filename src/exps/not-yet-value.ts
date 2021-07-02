import { Ctx } from "../ctx"
import { Core } from "../core"
import { Value } from "../value"
import { Neutral } from "../neutral"

export class NotYetValue extends Value {
  t: Value
  neutral: Neutral

  constructor(t: Value, neutral: Neutral) {
    super()
    this.t = t
    this.neutral = neutral
  }

  readback(ctx: Ctx, t: Value): Core {
    // NOTE  t and this.t are ignored here,
    //  maybe use them to debug.
    return this.neutral.readback_neutral(ctx)
  }
}
