import { Core } from "../../core"
import { Ctx } from "../../ctx"
import * as Exps from "../../exps"
import { Solution } from "../../solution"
import { readback, Value } from "../../value"

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

  unify(solution: Solution, ctx: Ctx, t: Value, that: Value): Solution {
    if (!(that instanceof Exps.Add1Value)) {
      return Solution.failure
    }

    return solution.unify(ctx, new Exps.NatValue(), this.prev, that.prev)
  }
}
