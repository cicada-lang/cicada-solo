import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import * as Cores from "../../cores"

export class QuoteValue extends Value {
  str: string

  constructor(str: string) {
    super()
    this.str = str
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Cores.StrValue) {
      return new Cores.Quote(this.str)
    }
  }
}
