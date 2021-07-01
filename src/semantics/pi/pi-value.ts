import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { readback } from "../../value"
import { Closure } from "../../closure"
import * as ut from "../../ut"
import * as Sem from "../../sem"

export class PiValue extends Value {
  arg_t: Value
  ret_t_cl: Closure

  constructor(arg_t: Value, ret_t_cl: Closure) {
    super()
    this.arg_t = arg_t
    this.ret_t_cl = ret_t_cl
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Sem.TypeValue) {
      const fresh_name = ut.freshen_name(new Set(ctx.names), this.ret_t_cl.name)
      const variable = new Sem.NotYetValue(
        this.arg_t,
        new Sem.VarNeutral(fresh_name)
      )
      const arg_t = readback(ctx, new Sem.TypeValue(), this.arg_t)
      const ret_t = readback(
        ctx.extend(fresh_name, this.arg_t),
        new Sem.TypeValue(),
        this.ret_t_cl.apply(variable)
      )
      return new Sem.Pi(fresh_name, arg_t, ret_t)
    }
  }

  eta_expand(ctx: Ctx, value: Value): Core {
    // NOTE everything with a function type
    //   is immediately read back as having a Lambda on top.
    //   This implements the η-rule for functions.
    const fresh_name = ut.freshen_name(new Set(ctx.names), this.ret_t_cl.name)
    const variable = new Sem.NotYetValue(
      this.arg_t,
      new Sem.VarNeutral(fresh_name)
    )
    const ret_t = this.ret_t_cl.apply(variable)
    const ret = readback(
      ctx.extend(fresh_name, this.arg_t),
      ret_t,
      Sem.Ap.apply(value, variable)
    )
    return new Sem.Fn(fresh_name, ret)
  }
}
