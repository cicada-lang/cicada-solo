import { Core } from "../../core"
import { Ctx } from "../../ctx"
import * as Exps from "../../exps"
import { Solution } from "../../solution"
import { readback, ReadbackEtaExpansion, Value } from "../../value"
import { Closure } from "../closure"

export class SigmaValue extends Value implements ReadbackEtaExpansion {
  car_t: Value
  cdr_t_cl: Closure

  constructor(car_t: Value, cdr_t_cl: Closure) {
    super()
    this.car_t = car_t
    this.cdr_t_cl = cdr_t_cl
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Exps.TypeValue) {
      const fresh_name = ctx.freshen(this.cdr_t_cl.name)
      const variable = new Exps.NotYetValue(
        this.car_t,
        new Exps.VarNeutral(fresh_name)
      )
      const car_t = readback(ctx, new Exps.TypeValue(), this.car_t)
      const cdr_t = readback(
        ctx.extend(fresh_name, this.car_t),
        new Exps.TypeValue(),
        this.cdr_t_cl.apply(variable)
      )
      return new Exps.SigmaCore(fresh_name, car_t, cdr_t)
    }
  }

  readback_eta_expansion(ctx: Ctx, value: Value): Core {
    // NOTE Pairs are also η-expanded.
    //   Every value with a pair type,
    //   whether it is neutral or not,
    //   is read back with cons at the top.
    const car = Exps.CarCore.apply(value)
    const cdr = Exps.CdrCore.apply(value)
    return new Exps.ConsCore(
      readback(ctx, this.car_t, car),
      readback(ctx, this.cdr_t_cl.apply(car), cdr)
    )
  }

  unify(solution: Solution, ctx: Ctx, t: Value, that: Value): Solution {
    if (!(that instanceof Exps.SigmaValue)) {
      return Solution.fail_to_be_the_same_value(ctx, t, this, that)
    }

    return solution
      .unify_type(ctx, this.car_t, that.car_t)
      .unify_type_closure(
        ctx,
        this.car_t,
        this.cdr_t_cl,
        that.car_t,
        that.cdr_t_cl
      )
  }
}
