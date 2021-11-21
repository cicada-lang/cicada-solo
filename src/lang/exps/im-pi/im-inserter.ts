import { Ctx } from "../../ctx"
import { Exp } from "../../exp"
import { check } from "../../exp"
import { subst } from "../../exp"
import { Core } from "../../core"
import { Solution } from "../../solution"
import { Value } from "../../value"
import * as Exps from "../../exps"
import { Closure } from "../closure"

export interface ImApInsertionEntry {
  arg_t: Value
  im_arg: Value
  not_yet_value: Exps.NotYetValue
}

export abstract class ImInserter {
  arg_t: Value
  ret_t_cl: Closure

  constructor(arg_t: Value, ret_t_cl: Closure) {
    this.arg_t = arg_t
    this.ret_t_cl = ret_t_cl
  }

  insert_im_fn(ctx: Ctx, fn: Exp, opts?: { name: string }): Core {
    const name = opts?.name || this.ret_t_cl.name
    const fresh_name = ctx.freshen(name)
    const variable = new Exps.VarNeutral(fresh_name)
    const arg = new Exps.NotYetValue(this.arg_t, variable)
    const ret_t = this.ret_t_cl.apply(arg)
    fn = subst(fn, name, new Exps.Var(fresh_name))
    const fn_core = check(ctx.extend(fresh_name, this.arg_t), fn, ret_t)
    return new Exps.ImFnCore(fresh_name, fn_core)
  }

  abstract insert_im_ap(
    ctx: Ctx,
    arg: Exp,
    target_core: Core,
    entries: Array<ImApInsertionEntry>
  ): { t: Value; core: Core }

  abstract solve_im_ap(ctx: Ctx, arg: Exp): Solution
}
