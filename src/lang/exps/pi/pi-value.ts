import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { evaluate } from "../../core"
import { check } from "../../exp"
import { readback } from "../../value"
import { Closure } from "../closure"
import * as ut from "../../../ut"
import * as Exps from "../../exps"
import { ReadbackEtaExpansion } from "../../value"

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
      return Solution.failure
    }

    solution = solution.unify_type(ctx, this.arg_t, that.arg_t)
    if (Solution.failure_p(solution)) return solution
    const names = new Set([
      ...solution.names,
      this.ret_t_cl.name,
      that.ret_t_cl.name,
    ])
    const fresh_name = ut.freshen(names, this.ret_t_cl.name)
    const variable = new Exps.VarNeutral(fresh_name)
    const this_variable = new Exps.NotYetValue(this.arg_t, variable)
    const that_variable = new Exps.NotYetValue(that.arg_t, variable)
    return solution.unify_type(
      ctx,
      this.ret_t_cl.apply(this_variable),
      that.ret_t_cl.apply(that_variable)
    )
  }
}
