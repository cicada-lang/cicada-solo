import { Ctx } from "../ctx"
import { Exp } from "../exp"
import * as Value from "../value"
import * as Neutral from "../neutral"
import { readback } from "../readback"
import * as Closure from "../closure"
import * as ut from "../ut"
import { TypeValue } from "./type-value"
import { Pi, Fn, Ap } from "../core"
import { NotYetValue } from "../core"
import { VarNeutral } from "../core"

export class PiValue {
  arg_t: Value.Value
  ret_t_cl: Closure.Closure

  constructor(arg_t: Value.Value, ret_t_cl: Closure.Closure) {
    this.arg_t = arg_t
    this.ret_t_cl = ret_t_cl
  }

  readback(ctx: Ctx, t: Value.Value): Exp | undefined {
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
        Closure.apply(this.ret_t_cl, variable)
      )
      return new Pi(fresh_name, arg_t, ret_t)
    }
  }

  eta_expand(ctx: Ctx, value: Value.Value): Exp {
    // NOTE everything with a function type
    //   is immediately read back as having a Lambda on top.
    //   This implements the η-rule for functions.
    const fresh_name = ut.freshen_name(new Set(ctx.names()), this.ret_t_cl.name)
    const variable = new NotYetValue(this.arg_t, new VarNeutral(fresh_name))
    return new Fn(
      fresh_name,
      readback(
        ctx.extend(fresh_name, this.arg_t),
        Closure.apply(this.ret_t_cl, variable),
        Ap.apply(value, variable)
      )
    )
  }
}
