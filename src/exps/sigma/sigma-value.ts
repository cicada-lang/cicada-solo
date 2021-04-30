import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { readback } from "../../readback"
import { Value } from "../../value"
import { Closure } from "../../closure"
import * as ut from "../../ut"
import { TypeValue } from "../../cores"
import { Sigma } from "../../cores"
import { Cons, Car, Cdr } from "../../cores"
import { NotYetValue } from "../../cores"
import { VarNeutral } from "../../cores"

export class SigmaValue {
  car_t: Value
  cdr_t_cl: Closure

  constructor(car_t: Value, cdr_t_cl: Closure) {
    this.car_t = car_t
    this.cdr_t_cl = cdr_t_cl
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof TypeValue) {
      const fresh_name = ut.freshen_name(
        new Set(ctx.names()),
        this.cdr_t_cl.name
      )
      const variable = new NotYetValue(this.car_t, new VarNeutral(fresh_name))
      const car_t = readback(ctx, new TypeValue(), this.car_t)
      const cdr_t = readback(
        ctx.extend(fresh_name, this.car_t),
        new TypeValue(),
        this.cdr_t_cl.apply(variable)
      )
      return new Sigma(fresh_name, car_t, cdr_t)
    }
  }

  eta_expand(ctx: Ctx, value: Value): Core {
    // NOTE Pairs are also η-expanded.
    //   Every value with a pair type,
    //   whether it is neutral or not,
    //   is read back with cons at the top.
    const car = Car.apply(value)
    const cdr = Cdr.apply(value)
    return new Cons(
      readback(ctx, this.car_t, car),
      readback(ctx, this.cdr_t_cl.apply(car), cdr)
    )
  }
}
