import { Core } from "../../core"
import { Ctx } from "../../ctx"
import * as Exps from "../../exps"
import { Solution } from "../../solution"
import { expect, Value } from "../../value"

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

  unify(solution: Solution, ctx: Ctx, t: Value, that: Value): Solution {
    if (!(that instanceof Exps.ConsValue)) {
      return Solution.failure
    }

    const sigma = expect(ctx, t, Exps.SigmaValue)
    return solution
      .unify(ctx, sigma.car_t, this.car, that.car)
      .unify(ctx, sigma.cdr_t_cl.apply(this.car), this.cdr, that.cdr)
  }
}
