import * as Exps from ".."
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Solution } from "../../solution"
import { readback, ReadbackEtaExpansion, Value } from "../../value"
import { Closure } from "../closure"
import { VagueInserter } from "./vague-inserter"

export class VaguePiValue extends Value implements ReadbackEtaExpansion {
  arg_t: Value
  ret_t_cl: Closure
  vague_inserter: VagueInserter

  constructor(arg_t: Value, ret_t_cl: Closure) {
    super()
    this.arg_t = arg_t
    this.ret_t_cl = ret_t_cl
    this.vague_inserter = new VagueInserter(arg_t, ret_t_cl)
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

      return new Exps.VaguePiCore(fresh_name, arg_t, ret_t_core)
    }
  }

  readback_eta_expansion(ctx: Ctx, value: Value): Core {
    // NOTE everything with a function type
    //   is immediately read back as having a Lambda on top.
    //   This implements the η-rule for functions.

    const fresh_name =
      value instanceof Exps.VagueFnValue
        ? ctx.freshen(value.ret_cl.name)
        : ctx.freshen(this.ret_t_cl.name)

    const variable = new Exps.VarNeutral(fresh_name)
    const not_yet_value = new Exps.NotYetValue(this.arg_t, variable)
    const pi = this.ret_t_cl.apply(not_yet_value)
    const result = readback(
      ctx.extend(fresh_name, this.arg_t),
      pi,
      Exps.VagueApCore.apply(value, not_yet_value)
    )

    return new Exps.VagueFnCore(fresh_name, result)
  }

  unify(solution: Solution, ctx: Ctx, t: Value, that: Value): Solution {
    if (!(that instanceof Exps.VaguePiValue)) {
      return Solution.failure
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
