import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { readback } from "../../value"
import { Value, Subst } from "../../value"
import { Closure } from "../closure"
import * as ut from "../../ut"
import * as Exps from "../../exps"

export class SigmaValue extends Value {
  car_t: Value
  cdr_t_cl: Closure

  constructor(car_t: Value, cdr_t_cl: Closure) {
    super()
    this.car_t = car_t
    this.cdr_t_cl = cdr_t_cl
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Exps.TypeValue) {
      const fresh_name = ut.freshen_name(new Set(ctx.names), this.cdr_t_cl.name)
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

  eta_expand(ctx: Ctx, value: Value): Core {
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

  unify(subst: Subst, that: Value): Subst {
    if (that instanceof Exps.SigmaValue) {
      subst = subst.unify(this.car_t, that.car_t)
      if (subst.null_p) return subst
      const names = new Set([
        ...subst.names,
        this.cdr_t_cl.name,
        that.cdr_t_cl.name,
      ])
      const fresh_name = ut.freshen_name(names, this.cdr_t_cl.name)
      const v = new Exps.VarNeutral(fresh_name)
      const this_v = new Exps.NotYetValue(this.car_t, v)
      const that_v = new Exps.NotYetValue(that.car_t, v)
      return subst.unify(
        this.cdr_t_cl.apply(this_v),
        that.cdr_t_cl.apply(that_v)
      )
    } else {
      return Subst.null
    }
  }
}
