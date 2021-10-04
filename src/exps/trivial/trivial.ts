import { Exp, ExpMeta, subst } from "../../exp"
import { Core } from "../../core"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { Ctx } from "../../ctx"
import * as Exps from "../../exps"

export class Trivial extends Exp {
  meta: ExpMeta

  constructor(meta: ExpMeta) {
    super()
    this.meta = meta
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set()
  }

  subst(name: string, exp: Exp): this {
    return this
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    return {
      t: new Exps.TypeValue(),
      core: new Exps.TrivialCore(),
    }
  }

  repr(): string {
    return "Trivial"
  }
}
