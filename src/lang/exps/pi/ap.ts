import { Exp, ExpMeta, ElaborationOptions, subst } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { evaluate } from "../../core"
import { infer } from "../../exp"
import { check } from "../../exp"
import { Value } from "../../value"
import { ExpTrace, InternalError } from "../../errors"
import * as ut from "../../../ut"
import * as Exps from "../../exps"

export class Ap extends Exp {
  meta: ExpMeta
  target: Exp
  arg: Exp

  constructor(target: Exp, arg: Exp, meta: ExpMeta) {
    super()
    this.meta = meta
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
    return new Ap(
      subst(this.target, name, exp),
      subst(this.arg, name, exp),
      this.meta
    )
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const { t, core } = infer(ctx, this.target)

    const target = evaluate(ctx.to_env(), core)
    if (target.ap_handler?.infer_by_target) {
      return target.ap_handler.infer_by_target(ctx, core, this.arg)
    }

    if (t instanceof Exps.PiValue) {
      return this.infer_for_pi(ctx, t, core)
    }

    if (t instanceof Exps.ImPiValue) {
      return t.insert_im_ap(ctx, this.arg, core, [])
    }

    throw new ExpTrace(
      [
        `I am expecting target value of type PiValue or ClsValue`,
        `  class name: ${target.constructor.name}`,
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

  ap_args_repr(): Array<string> {
    if (has_ap_args_repr(this.target)) {
      return [...this.target.ap_args_repr(), this.arg.repr()]
    } else {
      return [this.arg.repr()]
    }
  }

  ap_target_repr(): string {
    if (has_ap_target_repr(this.target)) {
      return this.target.ap_target_repr()
    } else {
      return this.target.repr()
    }
  }

  repr(): string {
    const target = this.ap_target_repr()
    const args = this.ap_args_repr().join(", ")
    return `${target}(${args})`
  }
}

function has_ap_args_repr(
  exp: Exp
): exp is Exp & { ap_args_repr(): Array<string> } {
  return (exp as any).ap_args_repr instanceof Function
}

function has_ap_target_repr(
  exp: Exp
): exp is Exp & { ap_target_repr(): string } {
  return (exp as any).ap_target_repr instanceof Function
}
