import { Ctx } from "../../ctx"
import { Exp } from "../../exp"
import { Core } from "../../core"
import { Solution } from "../../solution"
import { readback } from "../../value"
import { Value } from "../../value"
import { Closure } from "../closure"
import { ExpTrace } from "../../errors"
import * as ut from "../../../ut"
import * as Exps from "../../exps"
import { ImApInsertion, ImApInsertionEntry } from "./im-ap-insertion"
import { ImFnInsertion } from "./im-fn-insertion"
import { ReadbackEtaExpansion } from "../../value"

export abstract class ImPiValue
  extends Value
  implements ReadbackEtaExpansion, ImFnInsertion, ImApInsertion
{
  field_name: string
  arg_t: Value
  ret_t_cl: Closure

  constructor(field_name: string, arg_t: Value, ret_t_cl: Closure) {
    super()
    this.field_name = field_name
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

      if (
        !(
          ret_t_core instanceof Exps.PiCore ||
          ret_t_core instanceof Exps.ImPiCore
        )
      ) {
        throw new ExpTrace(
          [
            `I expect ret_t_core to be of type Exps.PiCore or Exps.ImPiCore.`,
            `  class name: ${ret_t_core.constructor.name}`,
          ].join("\n")
        )
      }

      return new Exps.ImPiCore(this.field_name, fresh_name, arg_t, ret_t_core)
    }
  }

  readback_eta_expansion(ctx: Ctx, value: Value): Core {
    // NOTE everything with a function type
    //   is immediately read back as having a Lambda on top.
    //   This implements the η-rule for functions.
    const fresh_name = ctx.freshen(this.ret_t_cl.name)
    const variable = new Exps.VarNeutral(fresh_name)
    const not_yet_value = new Exps.NotYetValue(this.arg_t, variable)
    const pi = this.ret_t_cl.apply(not_yet_value)
    const result = readback(
      ctx.extend(fresh_name, this.arg_t),
      pi,
      Exps.ImApCore.apply(value, not_yet_value)
    )

    if (!(result instanceof Exps.FnCore || result instanceof Exps.ImFnCore)) {
      throw new ExpTrace(
        [
          `I expect result to be Exps.FnCore or Exps.ImFnCore`,
          `but the constructor name I meet is: ${result.constructor.name}`,
        ].join("\n") + "\n"
      )
    }

    return new Exps.ImFnCore(this.field_name, fresh_name, result)
  }

  unify(solution: Solution, ctx: Ctx, t: Value, that: Value): Solution {
    if (that instanceof Exps.ImPiValue) {
      solution = solution.unify(this.arg_t, that.arg_t)
      if (Solution.failure_p(solution)) return solution
      const names = new Set([
        ...solution.names,
        this.ret_t_cl.name,
        that.ret_t_cl.name,
      ])
      const fresh_name = ut.freshen(names, this.ret_t_cl.name)
      const v = new Exps.VarNeutral(fresh_name)
      const this_v = new Exps.NotYetValue(this.arg_t, v)
      const that_v = new Exps.NotYetValue(that.arg_t, v)
      return solution.unify(
        this.ret_t_cl.apply(this_v),
        that.ret_t_cl.apply(that_v)
      )
    } else {
      return Solution.failure
    }
  }

  abstract insert_im_fn(
    ctx: Ctx,
    fn: Exps.Fn,
    renaming: Array<{
      field_name: string
      local_name: string
    }>
  ): Core

  abstract insert_im_ap(
    ctx: Ctx,
    arg: Exp,
    target_core: Core,
    entries: Array<ImApInsertionEntry>
  ): { t: Value; core: Core }

  abstract solve_im_ap(ctx: Ctx, arg: Exp): Solution
}
