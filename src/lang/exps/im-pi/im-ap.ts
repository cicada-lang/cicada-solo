import { Exp, ExpMeta, ElaborationOptions, subst } from "../../exp"
import { Core } from "../../core"
import { Env } from "../../env"
import { Ctx } from "../../ctx"
import { evaluate } from "../../core"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { Normal } from "../../normal"
import { InternalError } from "../../errors"
import * as Exps from "../../exps"
import { ApFormater } from "../pi/ap-formater"

export class ImAp extends Exp {
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

  subst(name: string, exp: Exp): ImAp {
    return new ImAp(
      subst(this.target, name, exp),
      subst(this.arg, name, exp),
      this.meta
    )
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    throw new Error("TODO")
  }

  ap_formater = new ApFormater(this, {
    decorate_arg: (arg) => `implicit ${arg}`,
  })

  format(): string {
    return this.ap_formater.format()
  }
}
