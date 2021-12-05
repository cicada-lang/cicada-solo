import { Core } from "../../core"
import { Ctx } from "../../ctx"
import * as Exps from "../../exps"
import { Solution } from "../../solution"
import { readback, Value } from "../../value"

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

  unify(solution: Solution, ctx: Ctx, t: Value, that: Value): Solution {
    if (!(that instanceof Exps.VectorValue)) {
      return Solution.failure
    }

    return solution
      .unify_type(ctx, this.elem_t, that.elem_t)
      .unify(ctx, new Exps.NatValue(), this.length, that.length)
  }
}
