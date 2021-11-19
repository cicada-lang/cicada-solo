import { Exp, ExpMeta, ElaborationOptions, subst } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { evaluate } from "../../core"
import { infer } from "../../exp"
import { check } from "../../exp"
import { check_by_infer } from "../../exp"
import { Value } from "../../value"
import { ExpTrace, InternalError } from "../../errors"
import * as ut from "../../../ut"
import * as Exps from "../../exps"
import { ApFormater } from "./ap-formater"

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

  check(ctx: Ctx, t: Value): Core {
    const inferred = infer(ctx, this.target)
    const target = evaluate(ctx.to_env(), inferred.core)
    // if (inferred.t instanceof Exps.FixedPiValue) {
    //   // TODO
    // }

    return check_by_infer(ctx, this, t)
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const inferred = infer(ctx, this.target)

    const target = evaluate(ctx.to_env(), inferred.core)
    if (target.ap_handler?.infer_by_target) {
      return target.ap_handler.infer_by_target(ctx, inferred.core, this.arg)
    }

    if (inferred.t instanceof Exps.PiValue) {
      return this.infer_for_pi(ctx, inferred.t, inferred.core)
    }

    if (inferred.t instanceof Exps.ImPiValue) {
      return inferred.t.insert_im_ap(ctx, this.arg, inferred.core, [])
    }

    throw new ExpTrace(
      [
        `I expect the inferred type to be PiValue or ImPiValue`,
        `  class name: ${inferred.t.constructor.name}`,
      ].join("\n")
    )
  }

  private infer_for_pi(
    ctx: Ctx,
    t: Exps.PiValue,
    core: Core
  ): { t: Value; core: Core } {
    const { arg_t, ret_t_cl } = t
    const arg_core = check(ctx, this.arg, arg_t)
    const arg_value = evaluate(ctx.to_env(), arg_core)
    return {
      t: ret_t_cl.apply(arg_value),
      core: new Exps.ApCore(core, arg_core),
    }
  }

  ap_formater = new ApFormater(this)

  format(): string {
    return this.ap_formater.format()
  }
}
