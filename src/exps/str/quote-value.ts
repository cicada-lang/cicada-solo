import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { StrValue } from "../../cores"
import { Quote } from "../../cores"

export class QuoteValue {
  str: string

  constructor(str: string) {
    this.str = str
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof StrValue) {
      return new Quote(this.str)
    }
  }
}
