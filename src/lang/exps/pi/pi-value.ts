import { Core } from "../../core"
import { Ctx } from "../../ctx"
import * as Exps from "../../exps"
import { Solution } from "../../solution"
import { readback, ReadbackEtaExpansion, Value } from "../../value"
import { Closure } from "../closure"

export class PiValue extends Value implements ReadbackEtaExpansion {
  arg_t: Value
  ret_t_cl: Closure

  constructor(arg_t: Value, ret_t_cl: Closure) {
    super()
    this.arg_t = arg_t
    this.ret_t_cl = ret_t_cl
  }

  static apply(pi: Value, arg: Value): Value {
    if (!(pi instanceof Exps.PiValue)) {
      throw new Error(
        [
          `I expect pi to be PiValue`,
          `  class name: ${pi.constructor.name}`,
        ].join("\n")
      )
    }

    return pi.ret_t_cl.apply(arg)
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Exps.TypeValue) {
      const fresh_name = ctx.freshen(this.ret_t_cl.name)
      const variable = new Exps.VarNeutral(fresh_name)
      const not_yet_value = new Exps.NotYetValue(this.arg_t, variable)
      const arg_t = readback(ctx, new Exps.TypeValue(), this.arg_t)
      const ret_t = readback(
        ctx.extend(fresh_name, this.arg_t),
        new Exps.TypeValue(),
        this.ret_t_cl.apply(not_yet_value)
      )
      return new Exps.PiCore(fresh_name, arg_t, ret_t)
    }
  }

  readback_eta_expansion(ctx: Ctx, value: Value): Core {
    // NOTE everything with a function type
    //   is immediately read back as having a Lambda on top.
    //   This implements the η-rule for functions.

    const fresh_name =
      value instanceof Exps.FnValue
        ? ctx.freshen(value.ret_cl.name)
        : ctx.freshen(this.ret_t_cl.name)

    const variable = new Exps.VarNeutral(fresh_name)
    const not_yet_value = new Exps.NotYetValue(this.arg_t, variable)
    const ret_t = this.ret_t_cl.apply(not_yet_value)
    const ret = readback(
      ctx.extend(fresh_name, this.arg_t),
      ret_t,
      Exps.ApCore.apply(value, not_yet_value)
    )
    return new Exps.FnCore(fresh_name, ret)
  }

  unify(solution: Solution, ctx: Ctx, t: Value, that: Value): Solution {
    if (!(that instanceof Exps.PiValue)) {
      return Solution.fail_to_be_the_same_value(ctx, t, this, that)
    }

    return solution
      .unify_type(ctx, this.arg_t, that.arg_t)
      .unify_type_closure(
        ctx,
        this.arg_t,
        this.ret_t_cl,
        that.arg_t,
        that.ret_t_cl
      )
  }
}
