import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { Solution } from "../../solution"
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

  unify(solution: Solution, that: Value): Solution {
    if (that instanceof Exps.ConsValue) {
      return solution.unify(this.car, that.car).unify(this.cdr, that.cdr)
    } else {
      return Solution.failure
    }
  }
}
