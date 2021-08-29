import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value, Subst } from "../../value"
import { readback } from "../../value"
import { Closure } from "../closure"
import { Trace } from "../../errors"
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
    if (t instanceof Exps.TypeValue) {
      const fresh_name = ut.freshen_name(new Set(ctx.names), this.pi_cl.name)
      const variable = new Exps.NotYetValue(
        this.arg_t,
        new Exps.VarNeutral(fresh_name)
      )
      const arg_t = readback(ctx, new Exps.TypeValue(), this.arg_t)
      const pi = readback(
        ctx.extend(fresh_name, this.arg_t),
        new Exps.TypeValue(),
        this.pi_cl.apply(variable)
      )

      if (!(pi instanceof Exps.PiCore)) {
        throw new Trace(
          [
            `I expect pi to be of type Exps.PiCore.`,
            `pi class name: ${pi.constructor.name}`,
          ].join("\n")
        )
      }

      return new Exps.PiImCore(fresh_name, arg_t, pi)
    }
  }

  eta_expand(ctx: Ctx, value: Value): Core {
    // NOTE everything with a function type
    //   is immediately read back as having a Lambda on top.
    //   This implements the η-rule for functions.
    const fresh_name = ut.freshen_name(new Set(ctx.names), this.pi_cl.name)
    const variable = new Exps.NotYetValue(
      this.arg_t,
      new Exps.VarNeutral(fresh_name)
    )
    const pi = this.pi_cl.apply(variable)
    const result = readback(
      ctx.extend(fresh_name, this.arg_t),
      pi,
      Exps.ApImCore.apply(value, variable)
    )

    if (!(result instanceof Exps.FnCore)) {
      throw new Trace(
        [
          `I expect result to be Exps.FnCore`,
          `but the constructor name I meet is: ${result.constructor.name}`,
        ].join("\n") + "\n"
      )
    }

    return new Exps.FnImCore(fresh_name, result)
  }
}
