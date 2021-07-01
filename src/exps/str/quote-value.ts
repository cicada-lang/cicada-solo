import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import * as Exps from "../../exps"

export class QuoteValue extends Value {
  str: string

  constructor(str: string) {
    super()
    this.str = str
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Exps.StrValue) {
      return new Exps.QuoteCore(this.str)
    }
  }
}
