import { Ctx } from "../ctx"
import { Exp } from "../exp"
import { Value } from "../value"
import { readback } from "../readback"
import { Closure } from "../closure"
import * as ut from "../ut"
import { TypeValue } from "../core"
import { Pi, Fn, Ap } from "../core"
import { NotYetValue } from "../core"
import { VarNeutral } from "../core"

export class PiValue {
  arg_t: Value
  ret_t_cl: Closure

  constructor(arg_t: Value, ret_t_cl: Closure) {
    this.arg_t = arg_t
    this.ret_t_cl = ret_t_cl
  }

  readback(ctx: Ctx, t: Value): Exp | undefined {
    if (t instanceof TypeValue) {
      const fresh_name = ut.freshen_name(
        new Set(ctx.names()),
        this.ret_t_cl.name
      )
      const variable = new NotYetValue(this.arg_t, new VarNeutral(fresh_name))
      const arg_t = readback(ctx, new TypeValue(), this.arg_t)
      const ret_t = readback(
        ctx.extend(fresh_name, this.arg_t),
        new TypeValue(),
        this.ret_t_cl.apply(variable)
      )
      return new Pi(fresh_name, arg_t, ret_t)
    }
  }

  eta_expand(ctx: Ctx, value: Value): Exp {
    // NOTE everything with a function type
    //   is immediately read back as having a Lambda on top.
    //   This implements the η-rule for functions.
    const fresh_name = ut.freshen_name(new Set(ctx.names()), this.ret_t_cl.name)
    const variable = new NotYetValue(this.arg_t, new VarNeutral(fresh_name))
    return new Fn(
      fresh_name,
      readback(
        ctx.extend(fresh_name, this.arg_t),
        this.ret_t_cl.apply(variable),
        Ap.apply(value, variable)
      )
    )
  }
}
