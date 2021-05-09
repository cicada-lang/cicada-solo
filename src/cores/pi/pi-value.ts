import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { readback } from "../../readback"
import { Closure } from "../../closure"
import * as ut from "../../ut"
import * as Cores from "../../cores"

export class PiValue {
  arg_t: Value
  ret_t_cl: Closure

  constructor(arg_t: Value, ret_t_cl: Closure) {
    this.arg_t = arg_t
    this.ret_t_cl = ret_t_cl
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Cores.TypeValue) {
      const fresh_name = ut.freshen_name(
        new Set(ctx.names()),
        this.ret_t_cl.name
      )
      const variable = new Cores.NotYetValue(
        this.arg_t,
        new Cores.VarNeutral(fresh_name)
      )
      const arg_t = readback(ctx, new Cores.TypeValue(), this.arg_t)
      const ret_t = readback(
        ctx.extend(fresh_name, this.arg_t),
        new Cores.TypeValue(),
        this.ret_t_cl.apply(variable)
      )
      return new Cores.Pi(fresh_name, arg_t, ret_t)
    }
  }

  eta_expand(ctx: Ctx, value: Value): Core {
    // NOTE everything with a function type
    //   is immediately read back as having a Lambda on top.
    //   This implements the η-rule for functions.
    const fresh_name = ut.freshen_name(new Set(ctx.names()), this.ret_t_cl.name)
    const variable = new Cores.NotYetValue(
      this.arg_t,
      new Cores.VarNeutral(fresh_name)
    )
    const ret_t = this.ret_t_cl.apply(variable)
    const ret = readback(
      ctx.extend(fresh_name, this.arg_t),
      ret_t,
      Cores.Ap.apply(value, variable)
    )
    return new Cores.Fn(fresh_name, ret)
  }
}
