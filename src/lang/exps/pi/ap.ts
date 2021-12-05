import { Core, evaluate } from "../../core"
import { Ctx } from "../../ctx"
import { ExpTrace } from "../../errors"
import { check, Exp, ExpMeta, infer, subst } from "../../exp"
import * as Exps from "../../exps"
import { readback, Value } from "../../value"
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

  infer(ctx: Ctx): { t: Value; core: Core } {
    const inferred = infer(ctx, this.target)

    const target = evaluate(ctx.to_env(), inferred.core)
    if (target.ap_handler?.infer_by_target) {
      return target.ap_handler.infer_by_target(ctx, inferred.core, this.arg)
    }

    if (inferred.t instanceof Exps.ImplicitPiValue) {
      return inferred.t.implicit_inserter.insert_implicit_ap(
        ctx,
        inferred.core,
        this.arg
      )
    }

    if (inferred.t instanceof Exps.PiValue) {
      const { arg_t, ret_t_cl } = inferred.t
      const arg_core = check(ctx, this.arg, arg_t)
      const arg_value = evaluate(ctx.to_env(), arg_core)
      return {
        t: ret_t_cl.apply(arg_value),
        core: new Exps.ApCore(inferred.core, arg_core),
      }
    }

    const inferred_t_core = readback(ctx, new Exps.TypeValue(), inferred.t)
    const inferred_t_format = inferred_t_core.format()
    throw new ExpTrace(
      [
        `I expect the inferred type to be PiValue or ImPiValue`,
        `  class name: ${inferred.t.constructor.name}`,
        `  application: ${this.format()}`,
        `  inferred.t: ${inferred_t_format}`,
      ].join("\n")
    )
  }

  ap_formater = new ApFormater(this)

  format(): string {
    return this.ap_formater.format()
  }
}
