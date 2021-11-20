import { Exp, ExpMeta, ElaborationOptions, subst } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { check } from "../../exp"
import { evaluate } from "../../core"
import { ExpTrace } from "../../errors"
import * as Exps from "../../exps"
import * as ut from "../../../ut"
import { PiFormater } from "../pi/pi-formater"

// NOTE In check-mode, implicit arguments is called "fixed",
//   which decorates on top of pi type,
//   and will be resolved from return type,
//   making it can not be used in infer-mode.

export class FixedPi extends Exp {
  meta: ExpMeta
  name: string
  arg_t: Exp
  ret_t: Exps.Pi | Exps.ImPi | Exps.FixedPi

  constructor(
    name: string,
    arg_t: Exp,
    ret_t: Exps.Pi | Exps.ImPi | Exps.FixedPi,
    meta: ExpMeta
  ) {
    super()
    this.meta = meta
    this.name = name
    this.arg_t = arg_t
    this.ret_t = ret_t
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.arg_t.free_names(bound_names),
      ...this.ret_t.free_names(new Set([...bound_names, this.name])),
    ])
  }

  subst(name: string, exp: Exp): FixedPi {
    if (name === this.name) {
      return new FixedPi(
        this.name,
        subst(this.arg_t, name, exp),
        this.ret_t,
        this.meta
      )
    } else {
      const free_names = exp.free_names(new Set())
      const fresh_name = ut.freshen(free_names, this.name)
      const ret_t = subst(this.ret_t, this.name, new Exps.Var(fresh_name))

      return new FixedPi(
        fresh_name,
        subst(this.arg_t, name, exp),
        subst(ret_t, name, exp) as Exps.Pi | Exps.ImPi | Exps.FixedPi,
        this.meta
      )
    }
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    throw new Error()
  }

  pi_formater: PiFormater = new PiFormater(this, {
    decorate_binding: (binding) => `fixed ${binding}`,
  })

  format(): string {
    return this.pi_formater.format()
  }
}
