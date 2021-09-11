import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { Subst } from "../../subst"
import { readback } from "../../value"
import * as Exps from "../../exps"

export class InrValue extends Value {
  right: Value

  constructor(right: Value) {
    super()
    this.right = right
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Exps.EitherValue) {
      return new Exps.InrCore(readback(ctx, t.right_t, this.right))
    }
  }

  unify(subst: Subst, that: Value): Subst {
    if (that instanceof Exps.InrValue) {
      return subst.unify(this.right, that.right)
    } else {
      return Subst.failure
    }
  }
}
