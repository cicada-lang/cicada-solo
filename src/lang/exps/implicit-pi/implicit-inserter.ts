import { Ctx } from "../../ctx"
import { Exp } from "../../exp"
import { check } from "../../exp"
import { subst } from "../../exp"
import { infer } from "../../exp"
import { Core } from "../../core"
import { evaluate } from "../../core"
import { Solution } from "../../solution"
import { Value } from "../../value"
import { readback } from "../../value"
import * as Exps from ".."
import * as ut from "../../../ut"
import { Closure } from "../closure"
import { ExpTrace } from "../../errors"

interface ImplicitApEntry {
  arg_t: Value
  implicit_arg: Value
}

export class ImplicitInserter {
  arg_t: Value
  ret_t_cl: Closure

  constructor(arg_t: Value, ret_t_cl: Closure) {
    this.arg_t = arg_t
    this.ret_t_cl = ret_t_cl
  }

  insert_implicit_fn(ctx: Ctx, exp: Exp): Core {
    const fresh_name = ut.freshen(
      exp.free_names(new Set()),
      ctx.freshen(this.ret_t_cl.name)
    )
    const variable = new Exps.VarNeutral(fresh_name)
    const arg = new Exps.NotYetValue(this.arg_t, variable)
    const ret_t = this.ret_t_cl.apply(arg)
    // NOTE We do not need to subst `exp` for the `fresh_name`,
    //   because inserted `fresh_name` must not occur in `exp`.
    const core = check(ctx.extend(fresh_name, this.arg_t), exp, ret_t)
    return new Exps.ImplicitFnCore(fresh_name, core)
  }

  insert_implicit_ap(
    ctx: Ctx,
    target_core: Core,
    arg: Exp
  ): { t: Value; core: Core } {
    const inferred_arg = infer(ctx, arg)
    const result = this.collect_implicit_ap_entries(ctx, inferred_arg.t, [])

    let result_core = target_core
    for (const entry of result.entries) {
      const arg_core = readback(ctx, entry.arg_t, entry.implicit_arg)
      result_core = new Exps.ImplicitApCore(result_core, arg_core)
    }

    return {
      t: result.ret_t_cl.apply(evaluate(ctx.to_env(), inferred_arg.core)),
      core: new Exps.ApCore(result_core, inferred_arg.core),
    }
  }

  collect_implicit_ap_entries(
    ctx: Ctx,
    inferred_arg_t: Value,
    entries: Array<ImplicitApEntry>
  ): { entries: Array<ImplicitApEntry>; ret_t_cl: Closure } {
    const entry = this.implicit_ap_entry(ctx, inferred_arg_t)
    const ret_t = this.ret_t_cl.apply(entry.implicit_arg)

    if (ret_t instanceof Exps.ImplicitPiValue) {
      return ret_t.implicit_inserter.collect_implicit_ap_entries(
        ctx,
        inferred_arg_t,
        [...entries, entry]
      )
    } else if (ret_t instanceof Exps.PiValue) {
      return {
        entries: [...entries, entry],
        ret_t_cl: ret_t.ret_t_cl,
      }
    } else {
      throw new ExpTrace(
        [
          `During application insertion`,
          `I expect the return type to be Exps.PiValue or Exps.ImplicitPiValue`,
          `  class name: ${ret_t.constructor.name}`,
        ].join("\n")
      )
    }
  }

  private implicit_ap_entry(ctx: Ctx, inferred_arg_t: Value): ImplicitApEntry {
    const solution = this.solve_implicit_args(ctx, inferred_arg_t)
    const fresh_name = ctx.freshen(this.ret_t_cl.name)
    const implicit_arg = solution.find(fresh_name)
    if (implicit_arg === undefined) {
      throw new ExpTrace(
        [
          `Fail to find ${fresh_name} in solution`,
          `  solution names: ${solution.names}`,
          `  this.arg_t class name: ${this.arg_t.constructor.name}`,
        ].join("\n")
      )
    }

    return { arg_t: this.arg_t, implicit_arg }
  }

  private solve_implicit_args(ctx: Ctx, inferred_arg_t: Value): Solution {
    const ret_t = this.implicit_ret_t(ctx, inferred_arg_t)

    if (ret_t instanceof Exps.ImplicitPiValue) {
      return ret_t.implicit_inserter.solve_implicit_args(ctx, inferred_arg_t)
    } else if (ret_t instanceof Exps.PiValue) {
      return Solution.empty.unify_or_fail(
        ctx,
        new Exps.TypeValue(),
        ret_t.arg_t,
        inferred_arg_t
      )
    } else {
      throw new ExpTrace(
        [
          `During application insertion`,
          `I expect the return type to be Exps.PiValue or Exps.ImplicitPiValue`,
          `  class name: ${ret_t.constructor.name}`,
        ].join("\n")
      )
    }
  }

  private implicit_ret_t(ctx: Ctx, inferred_arg_t: Value): Value {
    const fresh_name = ctx.freshen(this.ret_t_cl.name)
    const variable = new Exps.VarNeutral(fresh_name)
    const not_yet_value = new Exps.NotYetValue(this.arg_t, variable)
    const ret_t = this.ret_t_cl.apply(not_yet_value)
    return ret_t
  }
}
