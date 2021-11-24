import { ImplicitInserter, ImplicitApInsertionEntry } from "./implicit-inserter"
import { Ctx } from "../../ctx"
import { Exp } from "../../exp"
import { Core } from "../../core"
import { Solution } from "../../solution"
import { check } from "../../exp"
import { Value } from "../../value"
import { Closure } from "../closure"
import { ExpTrace } from "../../errors"
import * as Exps from ".."

export class MoreImplicitInserter extends ImplicitInserter {
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
    const ret_t = this.ret_t_cl.apply(not_yet_value)

    if (!(ret_t instanceof Exps.ImplicitPiValue)) {
      throw new ExpTrace(
        [
          `I expect ret_t to be Exps.ImPiValue,`,
          `  class name: ${ret_t.constructor.name}`,
        ].join("\n")
      )
    }

    return ret_t.implicit_inserter.solve_implicit_ap(
      ctx,
      inferred_arg_t,
      inferred_arg_core
    )
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
    const solution = this.solve_implicit_ap(
      ctx,
      inferred_arg_t,
      inferred_arg_core
    )
    const implicit_arg = solution.find(fresh_name)
    if (implicit_arg === undefined) {
      throw new ExpTrace(
        [
          `[ConsImPiValue.insert_implicit_ap]`,
          `Fail to find ${fresh_name} in solution`,
          `  solution names: ${solution.names}`,
          `  this.arg_t class name: ${this.arg_t.constructor.name}`,
          `  target_core: ${target_core.format()}`,
          `  inferred_arg_core: ${inferred_arg_core.format()}`,
        ].join("\n")
      )
    }

    const ret_t = this.ret_t_cl.apply(implicit_arg)

    if (!(ret_t instanceof Exps.ImplicitPiValue)) {
      throw new ExpTrace(
        [
          `I expect ret_t to be Exps.ImPiValue,`,
          `  class name: ${ret_t.constructor.name}`,
        ].join("\n")
      )
    }

    return ret_t.implicit_inserter.insert_implicit_ap(
      ctx,
      target_core,
      inferred_arg_t,
      inferred_arg_core,
      [...entries, { arg_t: this.arg_t, implicit_arg: implicit_arg }]
    )
  }
}
