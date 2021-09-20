import { Exp, subst } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { evaluate } from "../../core"
import { infer } from "../../exp"
import { check } from "../../exp"
import { Value, solve } from "../../value"
import { Trace, InternalError } from "../../errors"
import * as ut from "../../ut"
import * as Exps from "../../exps"
import { ImApInsertion } from "../im-pi/im-ap-insertion"

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
    return new Ap(subst(this.target, name, exp), subst(this.arg, name, exp))
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const inferred_target = infer(ctx, this.target)

    if (inferred_target.t instanceof Exps.PiValue) {
      return this.infer_for_pi(ctx, inferred_target.t, inferred_target.core)
    }

    if (ImApInsertion.based_on(inferred_target.t)) {
      return inferred_target.t.insert_im_ap(ctx, this, inferred_target.core)
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

  private infer_for_cls(
    ctx: Ctx,
    cls: Exps.ClsValue,
    target_core: Core
  ): { t: Value; core: Core } {
    if (cls instanceof Exps.ConsClsValue) {
      const arg_core = check(ctx, this.arg, cls.field_t)
      return {
        t: new Exps.TypeValue(),
        core: new Exps.ApCore(target_core, arg_core),
      }
    } else if (cls instanceof Exps.FulfilledClsValue) {
      return this.infer_for_cls(ctx, cls.rest_t, target_core)
    } else if (cls instanceof Exps.NilClsValue) {
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

  flatten_repr(args: Array<string> = new Array()): {
    target: string
    args: Array<string>
  } {
    if (this.target instanceof Ap) {
      return this.target.flatten_repr([this.arg.repr(), ...args])
    } else {
      return {
        target: this.target.repr(),
        args: [this.arg.repr(), ...args],
      }
    }
  }

  repr(): string {
    const { target, args } = this.flatten_repr()
    return `${target}(${args.join(", ")})`
  }
}
