import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { evaluate } from "../../core"
import { infer } from "../../exp"
import { check } from "../../exp"
import { Value } from "../../value"
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
        `Unknown subclass of Exps.ClsValue: ${cls.constructor.name}`
      )
    }
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const inferred_target = infer(ctx, this.target)
    if (inferred_target.t instanceof Exps.PiValue) {
      const pi = inferred_target.t
      const arg_core = check(ctx, this.arg, pi.arg_t)
      const arg_value = evaluate(ctx.to_env(), arg_core)

      return {
        t: pi.ret_t_cl.apply(arg_value),
        core: new Exps.ApCore(inferred_target.core, arg_core),
      }
    }

    const target_value = evaluate(ctx.to_env(), inferred_target.core)
    if (target_value instanceof Exps.ClsValue) {
      return this.infer_for_cls(ctx, target_value, inferred_target.core)
    }

    throw new Trace(`I am expecting value of type: PiValue or ClsValue`)
  }

  private multi_ap(args: Array<Exp> = new Array()): {
    target: Exp
    args: Array<Exp>
  } {
    if (this.target instanceof Ap) {
      return this.target.multi_ap([this.arg, ...args])
    } else {
      return { target: this.target, args: [this.arg, ...args] }
    }
  }

  repr(): string {
    const { target, args } = this.multi_ap()
    return `${target.repr()}(${args.map((arg) => arg.repr()).join(", ")})`
  }
}
