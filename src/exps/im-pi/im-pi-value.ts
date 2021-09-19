import { Ctx } from "../../ctx"
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

export class ImPiValue
  extends Value
  implements ImApInsertion, ImFnInsertion, ReadbackEtaExpansion
{
  arg_t: Value
  ret_t_cl: Closure

  constructor(arg_t: Value, ret_t_cl: Closure) {
    super()
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

      return new Exps.ImPiCore(fresh_name, arg_t, ret_t_core)
    }
  }

  readback_eta_expand(ctx: Ctx, value: Value): Core {
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

    if (!(result instanceof Exps.FnCore)) {
      throw new Trace(
        [
          `I expect result to be Exps.FnCore`,
          `but the constructor name I meet is: ${result.constructor.name}`,
        ].join("\n") + "\n"
      )
    }

    return new Exps.ImFnCore(fresh_name, result)
  }

  unify(solution: Solution, that: Value): Solution {
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

  insert_im_ap(ctx: Ctx, ap: Exps.Ap, core: Core): { t: Value; core: Core } {
    const { arg_t, ret_t_cl } = this
    const inferred_arg = infer(ctx, ap.arg)
    const fresh_name = ctx.freshen(ret_t_cl.name)
    const variable = new Exps.VarNeutral(fresh_name)
    const not_yet_value = new Exps.NotYetValue(arg_t, variable)
    const ret_t = ret_t_cl.apply(not_yet_value)

    if (!(ret_t instanceof Exps.PiValue)) {
      throw new Trace(
        [
          `When Exps.Ap.infer meet target of type Exps.ImPiValue,`,
          `It expects the result of applying ret_t_cl to logic variable to be Exps.PiValue,`,
          `  class name: ${ret_t.constructor.name}`,
        ].join("\n")
      )
    }

    const result = solve(not_yet_value, {
      ctx: ctx.extend(fresh_name, arg_t, not_yet_value),
      left: { t: new Exps.TypeValue(), value: ret_t.arg_t },
      right: { t: new Exps.TypeValue(), value: inferred_arg.t },
    })

    const real_ret_t = ret_t_cl.apply(result.value)

    if (!(real_ret_t instanceof Exps.PiValue)) {
      throw new Trace(
        [
          `When Exps.Ap.infer meet target of type Exps.ImPiValue,`,
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

  insert_im_fn(ctx: Ctx, fn: Exps.Fn): Core {
    // NOTE Implicit lambda insertion
    const { arg_t, ret_t_cl } = this
    const fresh_name = ctx.freshen(fn.name)
    const arg = new Exps.NotYetValue(arg_t, new Exps.VarNeutral(fresh_name))
    const ret_t = ret_t_cl.apply(arg)
    const result = check(ctx.extend(fresh_name, arg_t), fn, ret_t)

    if (!(result instanceof Exps.FnCore)) {
      throw new Trace(
        [
          `Fn.check expecting the result of elab to be Exps.FnCore`,
          `  class name: ${result.constructor.name}`,
        ].join("\n")
      )
    }

    return new Exps.ImFnCore(fresh_name, result)
  }
}
