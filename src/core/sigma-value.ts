import { Ctx } from "../ctx"
import { Exp } from "../exp"
import { readback } from "../readback"
import * as Value from "../value"
import * as Closure from "../closure"
import * as Neutral from "../neutral"
import * as ut from "../ut"
import { TypeValue } from "../core"
import { Sigma } from "../core"
import { Cons, Car, Cdr } from "../core"
import { NotYetValue } from "../core"
import { VarNeutral } from "../core"

export class SigmaValue {
  car_t: Value.Value
  cdr_t_cl: Closure.Closure

  constructor(car_t: Value.Value, cdr_t_cl: Closure.Closure) {
    this.car_t = car_t
    this.cdr_t_cl = cdr_t_cl
  }

  readback(ctx: Ctx, t: Value.Value): Exp | undefined {
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
        Closure.apply(this.cdr_t_cl, variable)
      )
      return new Sigma(fresh_name, car_t, cdr_t)
    }
  }

  eta_expand(ctx: Ctx, value: Value.Value): Exp {
    // NOTE Pairs are also η-expanded.
    //   Every value with a pair type,
    //   whether it is neutral or not,
    //   is read back with cons at the top.
    const car = Car.apply(value)
    const cdr = Cdr.apply(value)
    return new Cons(
      readback(ctx, this.car_t, car),
      readback(ctx, Closure.apply(this.cdr_t_cl, car), cdr)
    )
  }
}
