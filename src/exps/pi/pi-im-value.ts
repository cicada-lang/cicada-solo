import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { readback } from "../../value"
import { Closure } from "../closure"
import * as ut from "../../ut"
import * as Exps from "../../exps"

export class PiImValue extends Value {
  arg_t: Value
  pi_cl: Closure

  constructor(arg_t: Value, pi_cl: Closure) {
    super()
    this.arg_t = arg_t
    this.pi_cl = pi_cl
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    throw new Error("TODO")

    // if (t instanceof Exps.TypeValue) {
    //   const fresh_name = ut.freshen_name(new Set(ctx.names), this.ret_t_cl.name)
    //   const variable = new Exps.NotYetValue(
    //     this.arg_t,
    //     new Exps.VarNeutral(fresh_name)
    //   )
    //   const arg_t = readback(ctx, new Exps.TypeValue(), this.arg_t)
    //   const ret_t = readback(
    //     ctx.extend(fresh_name, this.arg_t),
    //     new Exps.TypeValue(),
    //     this.ret_t_cl.apply(variable)
    //   )
    //   return new Exps.PiCore(fresh_name, arg_t, ret_t)
    // }
  }

  eta_expand(ctx: Ctx, value: Value): Core {
    throw new Error("TODO")

    // // NOTE everything with a function type
    // //   is immediately read back as having a Lambda on top.
    // //   This implements the η-rule for functions.
    // const fresh_name = ut.freshen_name(new Set(ctx.names), this.ret_t_cl.name)
    // const variable = new Exps.NotYetValue(
    //   this.arg_t,
    //   new Exps.VarNeutral(fresh_name)
    // )
    // const ret_t = this.ret_t_cl.apply(variable)
    // const ret = readback(
    //   ctx.extend(fresh_name, this.arg_t),
    //   ret_t,
    //   Exps.ApCore.apply(value, variable)
    // )
    // return new Exps.FnCore(fresh_name, ret)
  }
}
