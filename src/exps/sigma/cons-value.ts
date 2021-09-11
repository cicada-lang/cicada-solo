import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { Subst } from "../../subst"
import * as Exps from "../../exps"

export class ConsValue extends Value {
  car: Value
  cdr: Value

  constructor(car: Value, cdr: Value) {
    super()
    this.car = car
    this.cdr = cdr
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    // NOTE eta expand
    return undefined
  }

  unify(subst: Subst, that: Value): Subst {
    if (that instanceof Exps.ConsValue) {
      return subst.unify(this.car, that.car).unify(this.cdr, that.cdr)
    } else {
      return Subst.failure
    }
  }
}
