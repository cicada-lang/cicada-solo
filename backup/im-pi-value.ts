import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Subst } from "../../solution"
import { readback } from "../../value"
import { evaluate } from "../../core"
import { infer } from "../../exp"
import { check } from "../../exp"
import { Value, solve } from "../../value"
import { Closure } from "../closure"
import { RecordClosure } from "../record-closure"
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
  implicit: Array<{ name: string; arg_t: Value }>
  ret_t_cl: RecordClosure

  constructor(
    implicit: Array<{ name: string; arg_t: Value }>,
    ret_t_cl: RecordClosure
  ) {
    super()
    this.implicit = implicit
    this.ret_t_cl = ret_t_cl
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    throw new Error("TODO")

    // if (t instanceof Exps.TypeValue) {
    //   const fresh_name = ut.freshen_name(new Set(ctx.names), this.ret_t_cl.name)
    //   const variable = new Exps.VarNeutral(fresh_name)
    //   const not_yet_value = new Exps.NotYetValue(this.arg_t, variable)
    //   const arg_t = readback(ctx, new Exps.TypeValue(), this.arg_t)
    //   const ret_t_core = readback(
    //     ctx.extend(fresh_name, this.arg_t),
    //     new Exps.TypeValue(),
    //     this.ret_t_cl.apply(not_yet_value)
    //   )

    //   if (!(ret_t_core instanceof Exps.PiCore)) {
    //     throw new Trace(
    //       [
    //         `I expect ret_t_core to be of type Exps.PiCore.`,
    //         `  class name: ${ret_t_core.constructor.name}`,
    //       ].join("\n")
    //     )
    //   }

    //   return new Exps.ImPiCore([{ name: fresh_name, arg_t }], ret_t_core)
    // }
  }

  readback_eta_expansion(ctx: Ctx, value: Value): Core {
    throw new Error("TODO")

    // // NOTE everything with a function type
    // //   is immediately read back as having a Lambda on top.
    // //   This implements the η-rule for functions.
    // const fresh_name = ut.freshen_name(new Set(ctx.names), this.ret_t_cl.name)
    // const variable = new Exps.VarNeutral(fresh_name)
    // const not_yet_value = new Exps.NotYetValue(this.arg_t, variable)
    // const pi = this.ret_t_cl.apply(not_yet_value)
    // const result = readback(
    //   ctx.extend(fresh_name, this.arg_t),
    //   pi,
    //   Exps.ImApCore.apply(value, not_yet_value)
    // )

    // if (!(result instanceof Exps.FnCore)) {
    //   throw new Trace(
    //     [
    //       `I expect result to be Exps.FnCore`,
    //       `but the constructor name I meet is: ${result.constructor.name}`,
    //     ].join("\n") + "\n"
    //   )
    // }

    // return new Exps.ImFnCore(fresh_name, result)
  }

  unify(solution: Subst, that: Value): Subst {
    throw new Error("TODO")

    // if (that instanceof Exps.BaseImPiValue) {
    //   solution = solution.unify(this.arg_t, that.arg_t)
    //   if (Subst.failure_p(solution)) return solution
    //   const names = new Set([
    //     ...solution.names,
    //     this.ret_t_cl.name,
    //     that.ret_t_cl.name,
    //   ])
    //   const fresh_name = ut.freshen_name(names, this.ret_t_cl.name)
    //   const v = new Exps.VarNeutral(fresh_name)
    //   const this_v = new Exps.NotYetValue(this.arg_t, v)
    //   const that_v = new Exps.NotYetValue(that.arg_t, v)
    //   return solution.unify(
    //     this.ret_t_cl.apply(this_v),
    //     that.ret_t_cl.apply(that_v)
    //   )
    // } else {
    //   return Subst.failure
    // }
  }

  insert_im_ap(ctx: Ctx, ap: Exps.Ap, core: Core): { t: Value; core: Core } {
    throw new Error("TODO")

    // const { arg_t, ret_t_cl } = this
    // const inferred_arg = infer(ctx, ap.arg)
    // const fresh_name = ut.freshen_name(new Set(ctx.names), ret_t_cl.name)
    // const variable = new Exps.VarNeutral(fresh_name)
    // const not_yet_value = new Exps.NotYetValue(arg_t, variable)
    // const ret_t = ret_t_cl.apply(not_yet_value)

    // if (!(ret_t instanceof Exps.PiValue)) {
    //   throw new Trace(
    //     [
    //       `When Exps.Ap.infer meet target of type Exps.BaseImPiValue,`,
    //       `It expects the result of applying ret_t_cl to logic variable to be Exps.PiValue,`,
    //       `  class name: ${ret_t.constructor.name}`,
    //     ].join("\n")
    //   )
    // }

    // const result = solve(not_yet_value, {
    //   ctx: ctx.extend(fresh_name, arg_t, not_yet_value),
    //   left: { t: new Exps.TypeValue(), value: ret_t.arg_t },
    //   right: { t: new Exps.TypeValue(), value: inferred_arg.t },
    // })

    // const real_ret_t = ret_t_cl.apply(result.value)

    // if (!(real_ret_t instanceof Exps.PiValue)) {
    //   throw new Trace(
    //     [
    //       `When Exps.Ap.infer meet target of type Exps.BaseImPiValue,`,
    //       `and when ret_t is Exps.PiValue,`,
    //       `it expects real_ret_t to also be Exps.PiValue,`,
    //       `  class name: ${real_ret_t.constructor.name}`,
    //     ].join("\n")
    //   )
    // }

    // return {
    //   t: real_ret_t.ret_t_cl.apply(evaluate(ctx.to_env(), inferred_arg.core)),
    //   core: new Exps.ApCore(
    //     new Exps.ImApCore(core, result.core),
    //     inferred_arg.core
    //   ),
    // }
  }

  insert_im_fn(ctx: Ctx, fn: Exps.Fn): Core {
    throw new Error("TODO")

    // // NOTE Implicit lambda insertion
    // const { arg_t, ret_t_cl } = this
    // const fresh_name = ut.freshen_name(new Set(ctx.names), fn.name)
    // const arg = new Exps.NotYetValue(arg_t, new Exps.VarNeutral(fresh_name))
    // const ret_t = ret_t_cl.apply(arg)
    // const result = check(ctx.extend(fresh_name, arg_t), fn, ret_t)

    // if (!(result instanceof Exps.FnCore)) {
    //   throw new Trace(
    //     [
    //       `Fn.check expecting the result of elab to be Exps.FnCore`,
    //       `  class name: ${result.constructor.name}`,
    //     ].join("\n")
    //   )
    // }

    // return new Exps.ImFnCore(fresh_name, result)
  }
}
