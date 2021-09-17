import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { evaluate } from "../../core"
import { infer } from "../../exp"
import { check } from "../../exp"
import { Value, solve } from "../../value"
import { Trace, InternalError } from "../../errors"
import * as ut from "../../ut"
import * as Exps from "../../exps"

export class Ap extends Exp {
  target: Exp
  arg: Exp

  constructor(target: Exp, arg: Exp) {
    super()
    this.target = target
    this.arg = arg
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.target.free_names(bound_names),
      ...this.arg.free_names(bound_names),
    ])
  }

  subst(name: string, exp: Exp): Ap {
    return new Ap(this.target.subst(name, exp), this.arg.subst(name, exp))
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const inferred_target = infer(ctx, this.target)
    if (inferred_target.t instanceof Exps.PiValue) {
      return this.infer_for_pi(ctx, inferred_target.t, inferred_target.core)
    } else if (inferred_target.t instanceof Exps.PiImValue) {
      return this.infer_for_pi_im(ctx, inferred_target.t, inferred_target.core)
    }

    const target_value = evaluate(ctx.to_env(), inferred_target.core)
    if (target_value instanceof Exps.ClsValue) {
      return this.infer_for_cls(ctx, target_value, inferred_target.core)
    }

    throw new Trace(
      [
        `I am expecting target value of type PiValue or ClsValue`,
        `  class name: ${target_value.constructor.name}`,
      ].join("\n")
    )
  }

  private infer_for_pi(
    ctx: Ctx,
    target_t: Exps.PiValue,
    target_core: Core
  ): { t: Value; core: Core } {
    const { arg_t, ret_t_cl } = target_t
    const arg_core = check(ctx, this.arg, arg_t)
    const arg_value = evaluate(ctx.to_env(), arg_core)
    return {
      t: ret_t_cl.apply(arg_value),
      core: new Exps.ApCore(target_core, arg_core),
    }
  }

  private infer_for_pi_im(
    ctx: Ctx,
    target_t: Exps.PiImValue,
    target_core: Core
  ): { t: Value; core: Core } {
    const { arg_t, ret_t_cl } = target_t
    const inferred_arg = infer(ctx, this.arg)
    const fresh_name = ut.freshen_name(new Set(ctx.names), ret_t_cl.name)
    const variable = new Exps.VarNeutral(fresh_name)
    const not_yet_value = new Exps.NotYetValue(arg_t, variable)
    const ret_t = ret_t_cl.apply(not_yet_value)

    if (ret_t instanceof Exps.PiValue) {
      const result = solve(not_yet_value, {
        ctx: ctx.extend(fresh_name, arg_t, not_yet_value),
        left: { t: new Exps.TypeValue(), value: ret_t.arg_t },
        right: { t: new Exps.TypeValue(), value: inferred_arg.t },
      })

      const real_ret_t = ret_t_cl.apply(result.value)

      if (!(real_ret_t instanceof Exps.PiValue)) {
        throw new Trace(
          [
            `When Exps.Ap.infer meet target of type Exps.PiImValue,`,
            `and when ret_t is Exps.PiValue,`,
            `it expects real_ret_t to also be Exps.PiValue,`,
            `  class name: ${real_ret_t.constructor.name}`,
          ].join("\n")
        )
      }

      return {
        t: real_ret_t.ret_t_cl.apply(evaluate(ctx.to_env(), inferred_arg.core)),
        core: new Exps.ApCore(
          new Exps.ApImCore(target_core, result.core),
          inferred_arg.core
        ),
      }
    }

    if (ret_t instanceof Exps.PiImValue) {
      const result = solve(not_yet_value, {
        ctx: ctx.extend(fresh_name, arg_t, not_yet_value),
        left: { t: new Exps.TypeValue(), value: ret_t.arg_t },
        right: { t: new Exps.TypeValue(), value: inferred_arg.t },
      })

      const real_ret_t = ret_t_cl.apply(result.value)

      if (!(real_ret_t instanceof Exps.PiImValue)) {
        throw new Trace(
          [
            `When Exps.Ap.infer meet target of type Exps.PiImValue,`,
            `and when ret_t is Exps.PiImValue,`,
            `it expects real_ret_t to also be Exps.PiImValue,`,
            `  class name: ${real_ret_t.constructor.name}`,
          ].join("\n")
        )
      }

      return {
        t: real_ret_t.ret_t_cl.apply(evaluate(ctx.to_env(), inferred_arg.core)),
        core: new Exps.ApCore(
          new Exps.ApImCore(target_core, result.core),
          inferred_arg.core
        ),
      }
    }

    throw new Trace(
      [
        `When Exps.Ap.infer meet target of type Exps.PiImValue,`,
        `It expects the result of applying ret_t_cl to logic variable to be Exps.PiValue or Exps.PiImValue,`,
        `  class name: ${ret_t.constructor.name}`,
      ].join("\n")
    )
  }

  private infer_for_cls(
    ctx: Ctx,
    cls: Exps.ClsValue,
    target_core: Core
  ): { t: Value; core: Core } {
    if (cls instanceof Exps.ClsConsValue) {
      const arg_core = check(ctx, this.arg, cls.field_t)
      return {
        t: new Exps.TypeValue(),
        core: new Exps.ApCore(target_core, arg_core),
      }
    } else if (cls instanceof Exps.ClsFulfilledValue) {
      return this.infer_for_cls(ctx, cls.rest_t, target_core)
    } else if (cls instanceof Exps.ClsNilValue) {
      throw new Trace(`The telescope is full.`)
    } else {
      throw new InternalError(
        [
          `Unknown subclass of Exps.ClsValue`,
          `  class name: ${cls.constructor.name}`,
        ].join("\n")
      )
    }
  }

  multi_ap_repr(args: Array<string> = new Array()): {
    target: string
    args: Array<string>
  } {
    if (this.target instanceof Ap) {
      return this.target.multi_ap_repr([this.arg.repr(), ...args])
    } else {
      return {
        target: this.target.repr(),
        args: [this.arg.repr(), ...args],
      }
    }
  }

  repr(): string {
    const { target, args } = this.multi_ap_repr()
    return `${target}(${args.join(", ")})`
  }
}
