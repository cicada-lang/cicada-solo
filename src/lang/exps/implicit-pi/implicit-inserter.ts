import { Ctx } from "../../ctx"
import { Exp } from "../../exp"
import { check } from "../../exp"
import { subst } from "../../exp"
import { Core } from "../../core"
import { Solution } from "../../solution"
import { Value } from "../../value"
import * as Exps from ".."
import * as ut from "../../../ut"
import { Closure } from "../closure"

export interface ImplicitApInsertionEntry {
  arg_t: Value
  implicit_arg: Value
  not_yet_value: Exps.NotYetValue
}

export abstract class ImplicitInserter {
  arg_t: Value
  ret_t_cl: Closure

  constructor(arg_t: Value, ret_t_cl: Closure) {
    this.arg_t = arg_t
    this.ret_t_cl = ret_t_cl
  }

  abstract insert_implicit_ap(
    ctx: Ctx,
    target_core: Core,
    inferred_arg_t: Value,
    inferred_arg_core: Core,
    entries: Array<ImplicitApInsertionEntry>
  ): { t: Value; core: Core }

  abstract solve_implicit_ap(
    ctx: Ctx,
    inferred_arg_t: Value,
    inferred_arg_core: Core
  ): Solution

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
}
