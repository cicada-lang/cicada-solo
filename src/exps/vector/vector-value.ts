import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value, Subst } from "../../value"
import { readback } from "../../value"
import * as Exps from "../../exps"

export class VectorValue extends Value {
  elem_t: Value
  length: Value

  constructor(elem_t: Value, length: Value) {
    super()
    this.elem_t = elem_t
    this.length = length
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Exps.TypeValue) {
      return new Exps.VectorCore(
        readback(ctx, new Exps.TypeValue(), this.elem_t),
        readback(ctx, new Exps.NatValue(), this.length)
      )
    }
  }

  unify(subst: Subst, that: Value): Subst {
    if (that instanceof Exps.VectorValue) {
      return subst
        .unify(this.elem_t, that.elem_t)
        .unify(this.length, that.length)
    } else {
      return Subst.null
    }
  }
}
