import { Ctx } from "../../ctx"
import { Exp } from "../../exp"
import { Core } from "../../core"
import { Solution } from "../../solution"
import { readback } from "../../value"
import { Value } from "../../value"
import { Closure } from "../closure"
import { ExpTrace } from "../../errors"
import * as ut from "../../../ut"
import * as Exps from ".."
import { ReadbackEtaExpansion } from "../../value"

export class ReturnedPiValue extends Value implements ReadbackEtaExpansion {
  arg_t: Value
  ret_t_cl: Closure

  constructor(arg_t: Value, ret_t_cl: Closure) {
    super()
    this.arg_t = arg_t
    this.ret_t_cl = ret_t_cl
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Exps.TypeValue) {
      const fresh_name = ctx.freshen(this.ret_t_cl.name)
      const variable = new Exps.VarNeutral(fresh_name)
      const not_yet_value = new Exps.NotYetValue(this.arg_t, variable)
      const arg_t = readback(ctx, new Exps.TypeValue(), this.arg_t)
      const ret_t_core = readback(
        ctx.extend(fresh_name, this.arg_t),
        new Exps.TypeValue(),
        this.ret_t_cl.apply(not_yet_value)
      )

      return new Exps.ReturnedPiCore(fresh_name, arg_t, ret_t_core)
    }
  }

  readback_eta_expansion(ctx: Ctx, value: Value): Core {
    // NOTE everything with a function type
    //   is immediately read back as having a Lambda on top.
    //   This implements the η-rule for functions.

    const fresh_name =
      value instanceof Exps.ReturnedFnValue
        ? ctx.freshen(value.ret_cl.name)
        : ctx.freshen(this.ret_t_cl.name)

    const variable = new Exps.VarNeutral(fresh_name)
    const not_yet_value = new Exps.NotYetValue(this.arg_t, variable)
    const pi = this.ret_t_cl.apply(not_yet_value)
    const result = readback(
      ctx.extend(fresh_name, this.arg_t),
      pi,
      Exps.ReturnedApCore.apply(value, not_yet_value)
    )

    return new Exps.ReturnedFnCore(fresh_name, result)
  }

  unify(solution: Solution, ctx: Ctx, t: Value, that: Value): Solution {
    if (!(that instanceof Exps.ReturnedPiValue)) {
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
