import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { readback } from "../../value"
import { Value } from "../../value"
import { Subst } from "../../subst"
import * as Exps from "../../exps"

export class EqualValue extends Value {
  t: Value
  from: Value
  to: Value

  constructor(t: Value, from: Value, to: Value) {
    super()
    this.t = t
    this.from = from
    this.to = to
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Exps.TypeValue) {
      return new Exps.EqualCore(
        readback(ctx, new Exps.TypeValue(), this.t),
        readback(ctx, this.t, this.from),
        readback(ctx, this.t, this.to)
      )
    }
  }

  unify(subst: Subst, that: Value): Subst {
    if (that instanceof Exps.EqualValue) {
      return subst
        .unify(this.t, that.t)
        .unify(this.from, that.from)
        .unify(this.to, that.to)
    } else {
      return Subst.null
    }
  }
}
