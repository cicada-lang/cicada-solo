import { Ctx } from "../../ctx"
import { Exp } from "../../exp"
import { Core } from "../../core"
import { Solution } from "../../solution"
import { readback } from "../../value"
import { evaluate } from "../../core"
import { infer } from "../../exp"
import { check } from "../../exp"
import { Value, solve } from "../../value"
import { Closure } from "../closure"
import { Trace } from "../../errors"
import * as ut from "../../ut"
import * as Exps from "../../exps"
import { ImApInsertion } from "./im-ap-insertion"
import { ImFnInsertion } from "./im-fn-insertion"
import { ReadbackEtaExpansion } from "../../value"

export class BaseImPiValue extends Exps.ImPiValue {
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

      if (!(ret_t_core instanceof Exps.PiCore)) {
        throw new Trace(
          [
            `I expect ret_t_core to be of type Exps.PiCore.`,
            `  class name: ${ret_t_core.constructor.name}`,
          ].join("\n")
        )
      }

      return new Exps.BaseImPiCore(
        this.field_name,
        fresh_name,
        arg_t,
        ret_t_core
      )
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
      throw new Trace(
        [
          `I expect result to be Exps.FnCore or Exps.ImFnCore`,
          `but the constructor name I meet is: ${result.constructor.name}`,
        ].join("\n") + "\n"
      )
    }

    return new Exps.ImFnCore(this.field_name, fresh_name, result)
  }

  unify(solution: Solution, that: Value): Solution {
    if (that instanceof Exps.BaseImPiValue) {
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

  insert_im_fn(
    ctx: Ctx,
    fn: Exps.Fn,
    renaming: Array<{
      field_name: string
      local_name: string
    }>
  ): Core {
    const found = renaming.find(
      ({ field_name }) => field_name === this.field_name
    )
    const local_name = found ? found.local_name : this.field_name
    const fresh_name = ctx.freshen(local_name)
    const arg = new Exps.NotYetValue(
      this.arg_t,
      new Exps.VarNeutral(fresh_name)
    )
    const ret_t = this.ret_t_cl.apply(arg)
    const fn_core = check(ctx.extend(fresh_name, this.arg_t), fn, ret_t)

    if (!(fn_core instanceof Exps.FnCore)) {
      throw new Trace(
        [
          `BaseImPiValue.insert_im_fn expecting the result of elab to be Exps.FnCore`,
          `  class name: ${fn_core.constructor.name}`,
        ].join("\n")
      )
    }

    return new Exps.ImFnCore(this.field_name, fresh_name, fn_core)
  }

  insert_im_ap(
    ctx: Ctx,
    arg: Exp,
    core: Core,
    args: Array<{ name: string; arg: Exp }>
  ): { t: Value; core: Core } {
    const inferred_arg = infer(ctx, arg)
    const fresh_name = ctx.freshen(this.ret_t_cl.name)
    const variable = new Exps.VarNeutral(fresh_name)
    const not_yet_value = new Exps.NotYetValue(this.arg_t, variable)
    const ret_t = this.ret_t_cl.apply(not_yet_value)

    if (!(ret_t instanceof Exps.PiValue)) {
      throw new Trace(
        [
          `When Exps.Ap.infer meet target of type Exps.BaseImPiValue,`,
          `It expects the result of applying ret_t_cl to logic variable to be Exps.PiValue,`,
          `  class name: ${ret_t.constructor.name}`,
        ].join("\n")
      )
    }

    const result = solve(not_yet_value, {
      ctx: ctx.extend(fresh_name, this.arg_t, not_yet_value),
      left: { t: new Exps.TypeValue(), value: ret_t.arg_t },
      right: { t: new Exps.TypeValue(), value: inferred_arg.t },
    })

    const real_ret_t = this.ret_t_cl.apply(result.value)

    if (!(real_ret_t instanceof Exps.PiValue)) {
      throw new Trace(
        [
          `When Exps.Ap.infer meet target of type Exps.BaseImPiValue,`,
          `and when ret_t is Exps.PiValue,`,
          `it expects real_ret_t to also be Exps.PiValue,`,
          `  class name: ${real_ret_t.constructor.name}`,
        ].join("\n")
      )
    }

    return {
      t: real_ret_t.ret_t_cl.apply(evaluate(ctx.to_env(), inferred_arg.core)),
      core: new Exps.ApCore(
        new Exps.ImApCore(core, result.core),
        inferred_arg.core
      ),
    }
  }
}
