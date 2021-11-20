import { Ctx } from "../../ctx"
import { Exp } from "../../exp"
import { Core } from "../../core"
import { Solution } from "../../solution"
import { check } from "../../exp"
import { Value } from "../../value"
import { Closure } from "../closure"
import { ExpTrace } from "../../errors"
import * as Exps from "../../exps"
import { ImApInsertionEntry } from "./im-pi-value"

export class ConsImPiValue extends Exps.ImPiValue {
  arg_t: Value
  ret_t_cl: Closure

  constructor(arg_t: Value, ret_t_cl: Closure) {
    super(arg_t, ret_t_cl)
    this.arg_t = arg_t
    this.ret_t_cl = ret_t_cl
  }

  insert_im_fn(ctx: Ctx, fn: Exps.Fn): Core {
    const fresh_name = ctx.freshen(this.ret_t_cl.name)
    const variable = new Exps.VarNeutral(fresh_name)
    const arg = new Exps.NotYetValue(this.arg_t, variable)
    const ret_t = this.ret_t_cl.apply(arg)
    const fn_core = check(ctx.extend(fresh_name, this.arg_t), fn, ret_t)

    if (!(fn_core instanceof Exps.FnCore || fn_core instanceof Exps.ImFnCore)) {
      throw new ExpTrace(
        [
          `ConsImPiValue.insert_im_fn expecting the result of elab to be Exps.FnCore or Exps.ImFnCore`,
          `  class name: ${fn_core.constructor.name}`,
        ].join("\n")
      )
    }

    return new Exps.ImFnCore(fresh_name, fn_core)
  }

  solve_im_ap(ctx: Ctx, arg: Exp): Solution {
    const fresh_name = ctx.freshen(this.ret_t_cl.name)
    const variable = new Exps.VarNeutral(fresh_name)
    const not_yet_value = new Exps.NotYetValue(this.arg_t, variable)
    const ret_t = this.ret_t_cl.apply(not_yet_value)

    if (!(ret_t instanceof Exps.ImPiValue)) {
      throw new ExpTrace(
        [
          `I expect ret_t to be Exps.ImPiValue,`,
          `  class name: ${ret_t.constructor.name}`,
        ].join("\n")
      )
    }

    return ret_t.solve_im_ap(ctx, arg)
  }

  insert_im_ap(
    ctx: Ctx,
    arg: Exp,
    target_core: Core,
    entries: Array<ImApInsertionEntry>
  ): { t: Value; core: Core } {
    const fresh_name = ctx.freshen(this.ret_t_cl.name)
    const variable = new Exps.VarNeutral(fresh_name)
    const not_yet_value = new Exps.NotYetValue(this.arg_t, variable)
    const solution = this.solve_im_ap(ctx, arg)
    const im_arg = solution.find(fresh_name)
    if (im_arg === undefined) {
      throw new ExpTrace(
        [
          `[ConsImPiValue.insert_im_ap]`,
          `Fail to find ${fresh_name} in solution`,
          `  solution names: ${solution.names}`,
          `  this.arg_t class name: ${this.arg_t.constructor.name}`,
          `  arg: ${arg.format()}`,
          `  target_core: ${target_core.format()}`,
        ].join("\n")
      )
    }

    const ret_t = this.ret_t_cl.apply(im_arg)

    if (!(ret_t instanceof Exps.ImPiValue)) {
      throw new ExpTrace(
        [
          `I expect ret_t to be Exps.ImPiValue,`,
          `  class name: ${ret_t.constructor.name}`,
        ].join("\n")
      )
    }

    return ret_t.insert_im_ap(ctx, arg, target_core, [
      ...entries,
      {
        arg_t: this.arg_t,
        im_arg,
        not_yet_value,
      },
    ])
  }
}
