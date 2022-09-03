import * as Exps from ".."
import { Core, evaluate } from "../../core"
import { Ctx } from "../../ctx"
import { ElaborationError } from "../../errors"
import { check, Exp, ExpMeta, infer, subst } from "../../exp"
import { Value } from "../../value"
import { ApFormater } from "../pi/ap-formater"

export class VagueAp extends Exp {
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

  subst(name: string, exp: Exp): VagueAp {
    return new VagueAp(
      subst(this.target, name, exp),
      subst(this.arg, name, exp),
      this.meta,
    )
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const inferred = infer(ctx, this.target)

    if (inferred.t instanceof Exps.VaguePiValue) {
      const { arg_t, ret_t_cl } = inferred.t
      const arg_core = check(ctx, this.arg, arg_t)
      const arg_value = evaluate(ctx.toEnv(), arg_core)
      return {
        t: ret_t_cl.apply(arg_value),
        core: new Exps.VagueApCore(inferred.core, arg_core),
      }
    }

    throw new ElaborationError(
      [
        `I expect the inferred type to be ImPiValue`,
        `  class name: ${inferred.t.constructor.name}`,
      ].join("\n"),
    )
  }

  ap_formater = new ApFormater(this, {
    decorate_arg: (arg) => `vague ${arg}`,
  })

  format(): string {
    return this.ap_formater.format()
  }
}
