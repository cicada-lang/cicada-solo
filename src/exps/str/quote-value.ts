import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value, Subst } from "../../value"
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

  unify(subst: Subst, that: Value): Subst {
    if (that instanceof Exps.QuoteValue && that.str === this.str) {
      return subst
    } else {
      return Subst.null
    }
  }
}
