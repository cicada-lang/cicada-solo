import { ImplicitInserter, ImplicitApEntry } from "./implicit-inserter"
import { Ctx } from "../../ctx"
import { Exp } from "../../exp"
import { Core } from "../../core"
import { Solution } from "../../solution"
import { readback } from "../../value"
import { evaluate } from "../../core"
import { infer } from "../../exp"
import { check } from "../../exp"
import { Value, expect } from "../../value"
import { Closure } from "../closure"
import { ExpTrace } from "../../errors"
import * as Exps from ".."

export class LastImplicitInserter extends ImplicitInserter {
  arg_t: Value
  ret_t_cl: Closure

  constructor(arg_t: Value, ret_t_cl: Closure) {
    super(arg_t, ret_t_cl)
    this.arg_t = arg_t
    this.ret_t_cl = ret_t_cl
  }

  solve_implicit_ap(
    ctx: Ctx,
    inferred_arg_t: Value,
    inferred_arg_core: Core
  ): Solution {
    const fresh_name = ctx.freshen(this.ret_t_cl.name)
    const variable = new Exps.VarNeutral(fresh_name)
    const not_yet_value = new Exps.NotYetValue(this.arg_t, variable)
    const ret_t = expect(ctx, this.ret_t_cl.apply(not_yet_value), Exps.PiValue)
    const solution = Solution.empty.unify_or_fail(
      ctx,
      new Exps.TypeValue(),
      ret_t.arg_t,
      inferred_arg_t
    )
    return solution
  }

  collect_implicit_ap_entries(
    ctx: Ctx,
    inferred_arg_t: Value,
    inferred_arg_core: Core,
    entries: Array<ImplicitApEntry>
  ): { entries: Array<ImplicitApEntry>; ret_t_cl: Closure } {
    const fresh_name = ctx.freshen(this.ret_t_cl.name)
    const variable = new Exps.VarNeutral(fresh_name)
    const not_yet_value = new Exps.NotYetValue(this.arg_t, variable)
    const ret_t = expect(ctx, this.ret_t_cl.apply(not_yet_value), Exps.PiValue)
    const solution = this.solve_implicit_ap(
      ctx,
      inferred_arg_t,
      inferred_arg_core
    )

    const implicit_arg = solution.find(fresh_name)

    if (implicit_arg === undefined) {
      throw new ExpTrace(
        [
          `Fail to find ${fresh_name} in solution`,
          `  solution names: ${solution.names}`,
          `  this.arg_t class name: ${this.arg_t.constructor.name}`,
          `  inferred_arg_core: ${inferred_arg_core.format()}`,
        ].join("\n")
      )
    }

    const pi = expect(ctx, this.ret_t_cl.apply(implicit_arg), Exps.PiValue)

    return {
      entries: [...entries, { arg_t: this.arg_t, implicit_arg }],
      ret_t_cl: pi.ret_t_cl,
    }
  }
}
