import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { readback } from "../../value"
import { Value } from "../../value"
import { Closure } from "../../closure"
import * as ut from "../../ut"
import * as Sem from "../../sem"

export class SigmaValue extends Value {
  car_t: Value
  cdr_t_cl: Closure

  constructor(car_t: Value, cdr_t_cl: Closure) {
    super()
    this.car_t = car_t
    this.cdr_t_cl = cdr_t_cl
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Sem.TypeValue) {
      const fresh_name = ut.freshen_name(new Set(ctx.names), this.cdr_t_cl.name)
      const variable = new Sem.NotYetValue(
        this.car_t,
        new Sem.VarNeutral(fresh_name)
      )
      const car_t = readback(ctx, new Sem.TypeValue(), this.car_t)
      const cdr_t = readback(
        ctx.extend(fresh_name, this.car_t),
        new Sem.TypeValue(),
        this.cdr_t_cl.apply(variable)
      )
      return new Sem.Sigma(fresh_name, car_t, cdr_t)
    }
  }

  eta_expand(ctx: Ctx, value: Value): Core {
    // NOTE Pairs are also η-expanded.
    //   Every value with a pair type,
    //   whether it is neutral or not,
    //   is read back with cons at the top.
    const car = Sem.Car.apply(value)
    const cdr = Sem.Cdr.apply(value)
    return new Sem.Cons(
      readback(ctx, this.car_t, car),
      readback(ctx, this.cdr_t_cl.apply(car), cdr)
    )
  }
}
