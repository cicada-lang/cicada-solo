import { ImInserter, ImApInsertionEntry } from "./im-inserter"
import { Ctx } from "../../ctx"
import { Exp } from "../../exp"
import { Core } from "../../core"
import { Solution } from "../../solution"
import { check } from "../../exp"
import { Value } from "../../value"
import { Closure } from "../closure"
import { ExpTrace } from "../../errors"
import * as Exps from "../../exps"

export class MoreImInserter extends ImInserter {
  arg_t: Value
  ret_t_cl: Closure

  constructor(arg_t: Value, ret_t_cl: Closure) {
    super(arg_t, ret_t_cl)
    this.arg_t = arg_t
    this.ret_t_cl = ret_t_cl
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

    return ret_t.im_inserter.solve_im_ap(ctx, arg)
  }

  insert_im_ap(
    ctx: Ctx,
    target: Core,
    arg: Exp,
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
          `  target: ${target.format()}`,
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

    return ret_t.im_inserter.insert_im_ap(ctx, target, arg, [
      ...entries,
      {
        arg_t: this.arg_t,
        im_arg,
        not_yet_value,
      },
    ])
  }
}
