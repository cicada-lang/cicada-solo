import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { readback } from "../../value"
import { Value } from "../../value"
import { Solution } from "../../solution"
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

  unify(solution: Solution, ctx: Ctx, t: Value, that: Value): Solution {
    if (that instanceof Exps.EqualValue) {
      return solution
        .unify(this.t, that.t)
        .unify(this.from, that.from)
        .unify(this.to, that.to)
    } else {
      return Solution.failure
    }
  }
}
