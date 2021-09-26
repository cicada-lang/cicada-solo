import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { Solution } from "../../solution"
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

  unify(solution: Solution, that: Value): Solution {
    if (that instanceof Exps.Add1Value) {
      return solution.unify(this.prev, that.prev)
    } else {
      return Solution.failure
    }
  }
}
