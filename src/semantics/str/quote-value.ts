import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import * as Sem from "../../sem"

export class QuoteValue extends Value {
  str: string

  constructor(str: string) {
    super()
    this.str = str
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Sem.StrValue) {
      return new Sem.QuoteCore(this.str)
    }
  }
}
