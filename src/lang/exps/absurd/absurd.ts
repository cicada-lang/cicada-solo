import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Exp, ExpMeta, ElaborationOptions, subst } from "../../exp"
import { Value } from "../../value"
import { Solution } from "../../solution"
import * as Exps from "../../exps"

export class Absurd extends Exp {
  meta: ExpMeta

  constructor(meta: ExpMeta) {
    super()
    this.meta = meta
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set()
  }

  subst(name: string, exp: Exp): Exp {
    return this
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    return {
      t: new Exps.TypeValue(),
      core: new Exps.AbsurdCore(),
    }
  }

  repr(): string {
    return "Absurd"
  }
}
