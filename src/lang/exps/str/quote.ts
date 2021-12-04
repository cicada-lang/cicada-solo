import { Exp, ExpMeta, subst } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value, readback } from "../../value"
import { Solution } from "../../solution"
import * as Exps from "../../exps"

export class Quote extends Exp {
  meta: ExpMeta
  str: string

  constructor(str: string, meta: ExpMeta) {
    super()
    this.meta = meta
    this.str = str
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set()
  }

  subst(name: string, exp: Exp): this {
    return this
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    return {
      t: new Exps.StrValue(),
      core: new Exps.QuoteCore(this.str),
    }
  }

  format(): string {
    return `"${this.str}"`
  }
}
