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
import * as Exps from "../../exps"
import { ImApInsertionEntry } from "./im-pi-value"

export class BaseImPiValue extends Exps.ImPiValue {
  field_name: string
  arg_t: Value
  ret_t_cl: Closure

  constructor(field_name: string, arg_t: Value, ret_t_cl: Closure) {
    super(field_name, arg_t, ret_t_cl)
    this.field_name = field_name
    this.arg_t = arg_t
    this.ret_t_cl = ret_t_cl
  }

  insert_im_fn(
    ctx: Ctx,
    fn: Exps.Fn,
    renaming?: {
      field_name: string
      local_name: string
    }
  ): Core {
    const local_name =
      renaming && renaming.field_name === this.field_name
        ? renaming.local_name
        : this.field_name

    const fresh_name = ctx.freshen(local_name)
    const arg = new Exps.NotYetValue(
      this.arg_t,
      new Exps.VarNeutral(fresh_name)
    )
    const ret_t = this.ret_t_cl.apply(arg)
    const fn_core = check(ctx.extend(fresh_name, this.arg_t), fn, ret_t)

    if (!(fn_core instanceof Exps.FnCore)) {
      throw new ExpTrace(
        [
          `BaseImPiValue.insert_im_fn expecting the result of elab to be Exps.FnCore`,
          `  class name: ${fn_core.constructor.name}`,
        ].join("\n")
      )
    }

    return new Exps.ImFnCore(this.field_name, fresh_name, fn_core)
  }

  solve_im_ap(ctx: Ctx, arg: Exp): Solution {
    const fresh_name = ctx.freshen(this.field_name)
    const variable = new Exps.VarNeutral(fresh_name)
    const not_yet_value = new Exps.NotYetValue(this.arg_t, variable)
    const ret_t = expect(ctx, this.ret_t_cl.apply(not_yet_value), Exps.PiValue)
    const inferred_arg = infer(ctx, arg)
    const solution = Solution.empty.unify_or_fail(
      ctx,
      new Exps.TypeValue(),
      ret_t.arg_t,
      inferred_arg.t
    )

    // prettier-ignore
    // {
    //   // DEBUG
    //   console.log("solving")
    //   console.log("  this  pi arg_t:", readback(ctx, new Exps.TypeValue, ret_t.arg_t).format())
    //   console.log("  inferred arg.t:", readback(ctx, new Exps.TypeValue, inferred_arg.t).format())
    //   console.log("  solved names:", solution.names)
    //   console.log()
    // }

    return solution
  }

  insert_im_ap(
    ctx: Ctx,
    arg: Exp,
    target_core: Core,
    entries: Array<ImApInsertionEntry>
  ): { t: Value; core: Core } {
    const fresh_name = ctx.freshen(this.field_name)
    const variable = new Exps.VarNeutral(fresh_name)
    const not_yet_value = new Exps.NotYetValue(this.arg_t, variable)
    const ret_t = expect(ctx, this.ret_t_cl.apply(not_yet_value), Exps.PiValue)

    const inferred_arg = infer(ctx, arg)

    const solution = this.solve_im_ap(ctx, arg)

    let target = target_core

    for (const entry of entries) {
      const im_arg_core = readback(ctx, entry.arg_t, entry.im_arg)
      target = new Exps.ImApCore(target, im_arg_core)

      // {
      //   // DEBUG
      //   const core = new Exps.ApCore(target, inferred_arg.core)
      //   console.log("- im-ap insertion :", core.format())
      // }
    }

    const im_arg = solution.find(fresh_name)
    if (im_arg === undefined) {
      throw new ExpTrace(
        [
          `[BaseImPiValue.insert_im_ap]`,
          `Fail to find ${fresh_name} in solution`,
          `  solution names: ${solution.names}`,
          `  this.arg_t class name: ${this.arg_t.constructor.name}`,
          `  this.field_name: ${this.field_name}`,
          `  arg: ${arg.format()}`,
          `  target_core: ${target_core.format()}`,
        ].join("\n")
      )
    }

    const im_arg_core = readback(ctx, this.arg_t, im_arg)

    // {
    //   // DEBUG
    //   console.log("- inserting im-ap arg:", im_arg_core.format())
    // }

    target = new Exps.ImApCore(target, im_arg_core)

    const final_ret_t = expect(ctx, this.ret_t_cl.apply(im_arg), Exps.PiValue)

    return {
      t: final_ret_t.ret_t_cl.apply(evaluate(ctx.to_env(), inferred_arg.core)),
      core: new Exps.ApCore(target, inferred_arg.core),
    }
  }
}
