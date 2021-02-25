import { Ctx } from "../ctx"
import { Exp } from "../exp"
import * as Value from "../value"
import * as Neutral from "../neutral"
import { readback } from "../readback"
import * as Closure from "../value/closure"
import * as ut from "../ut"
import { TypeValue } from "./type-value"
import { Pi } from "./pi"

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
      const variable = Value.not_yet(this.arg_t, Neutral.v(fresh_name))
      const arg_t = readback(ctx, Value.type, this.arg_t)
      const ret_t = readback(
        ctx.extend(fresh_name, this.arg_t),
        Value.type,
        Value.Closure.apply(this.ret_t_cl, variable)
      )
      return new Pi(fresh_name, arg_t, ret_t)
    }
  }
}
