import { Exp, ExpMeta, subst } from "../../exp"
import { Core } from "../../core"
import { Env } from "../../env"
import { Ctx } from "../../ctx"
import { infer } from "../../exp"
import { check } from "../../exp"
import { evaluate } from "../../core"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { Normal } from "../../normal"
import { ExpTrace, InternalError } from "../../errors"
import * as Exps from ".."
import { ApFormater } from "../pi/ap-formater"

export class ImplicitAp extends Exp {
  meta: ExpMeta
  target: Exp
  arg: Exp

  constructor(target: Exp, arg: Exp, meta: ExpMeta) {
    super()
    this.target = target
    this.arg = arg
    this.meta = meta
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.target.free_names(bound_names),
      ...this.arg.free_names(bound_names),
    ])
  }

  subst(name: string, exp: Exp): ImplicitAp {
    return new ImplicitAp(
      subst(this.target, name, exp),
      subst(this.arg, name, exp),
      this.meta
    )
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const inferred = infer(ctx, this.target)

    if (inferred.t instanceof Exps.ImplicitPiValue) {
      const { arg_t, ret_t_cl } = inferred.t
      const arg_core = check(ctx, this.arg, arg_t)
      const arg_value = evaluate(ctx.to_env(), arg_core)
      return {
        t: ret_t_cl.apply(arg_value),
        core: new Exps.ImplicitApCore(inferred.core, arg_core),
      }
    }

    throw new ExpTrace(
      [
        `I expect the inferred type to be ImPiValue`,
        `  class name: ${inferred.t.constructor.name}`,
      ].join("\n")
    )
  }

  ap_formater = new ApFormater(this, {
    decorate_arg: (arg) => `implicit ${arg}`,
  })

  format(): string {
    return this.ap_formater.format()
  }
}
