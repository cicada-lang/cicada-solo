import { Ctx } from "../ctx"
import { Exp } from "../exp"
import { Value } from "../value"
import { StrValue } from "./str-value"
import { Quote } from "./quote"

export class QuoteValue {
  str: string

  constructor(str: string) {
    this.str = str
  }

  readback(ctx: Ctx, t: Value): Exp | undefined {
    if (t instanceof StrValue) {
      return new Quote(this.str)
    }
  }
}
