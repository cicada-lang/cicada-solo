import { Core } from "../../core"
import { Ctx } from "../../ctx"
import * as Exps from "../../exps"
import { Solution } from "../../solution"
import { readback, Value } from "../../value"

export class ListValue extends Value {
  elem_t: Value

  constructor(elem_t: Value) {
    super()
    this.elem_t = elem_t
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Exps.TypeValue) {
      return new Exps.ListCore(readback(ctx, new Exps.TypeValue(), this.elem_t))
    }
  }

  unify(solution: Solution, ctx: Ctx, t: Value, that: Value): Solution {
    if (!(that instanceof Exps.ListValue)) {
      return Solution.failure
    }

    return solution.unify_type(ctx, this.elem_t, that.elem_t)
  }
}
