import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value, Subst } from "../../value"
import { readback } from "../../value"
import * as Exps from "../../exps"

export class Add1Value extends Value {
  prev: Value

  constructor(prev: Value) {
    super()
    this.prev = prev
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Exps.NatValue) {
      return new Exps.Add1Core(readback(ctx, t, this.prev))
    }
  }

  unify(subst: Subst, that: Value): Subst {
    if (that instanceof Exps.Add1Value) {
      return subst.unify(this.prev, that.prev)
    } else {
      return Subst.null
    }
  }
}
