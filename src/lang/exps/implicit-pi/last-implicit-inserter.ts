import { ImplicitInserter, ImplicitApInsertionEntry } from "./implicit-inserter"
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

  insert_implicit_ap(
    ctx: Ctx,
    target_core: Core,
    inferred_arg_t: Value,
    inferred_arg_core: Core,
    entries: Array<ImplicitApInsertionEntry>
  ): { t: Value; core: Core } {
    const fresh_name = ctx.freshen(this.ret_t_cl.name)
    const variable = new Exps.VarNeutral(fresh_name)
    const not_yet_value = new Exps.NotYetValue(this.arg_t, variable)
    const ret_t = expect(ctx, this.ret_t_cl.apply(not_yet_value), Exps.PiValue)
    const solution = this.solve_implicit_ap(
      ctx,
      inferred_arg_t,
      inferred_arg_core
    )

    for (const entry of entries) {
      const implicit_arg_core = readback(ctx, entry.arg_t, entry.implicit_arg)
      target_core = new Exps.ImplicitApCore(target_core, implicit_arg_core)
    }

    const implicit_arg = solution.find(fresh_name)
    if (implicit_arg === undefined) {
      throw new ExpTrace(
        [
          `[BaseImPiValue.insert_implicit_ap]`,
          `Fail to find ${fresh_name} in solution`,
          `  solution names: ${solution.names}`,
          `  this.arg_t class name: ${this.arg_t.constructor.name}`,
          `  target_core: ${target_core.format()}`,
          `  inferred_arg_core: ${inferred_arg_core.format()}`,
        ].join("\n")
      )
    }

    const implicit_arg_core = readback(ctx, this.arg_t, implicit_arg)

    target_core = new Exps.ImplicitApCore(target_core, implicit_arg_core)

    const final_ret_t = expect(
      ctx,
      this.ret_t_cl.apply(implicit_arg),
      Exps.PiValue
    )

    return {
      t: final_ret_t.ret_t_cl.apply(evaluate(ctx.to_env(), inferred_arg_core)),
      core: new Exps.ApCore(target_core, inferred_arg_core),
    }
  }
}
