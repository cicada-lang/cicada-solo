import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Exp, ExpMeta } from "../../exp"
import * as Exps from "../../exps"
import { Value } from "../../value"

export class Nat extends Exp {
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

  evaluate(env: Env): Value {
    return new Exps.NatValue()
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    return {
      t: new Exps.TypeValue(),
      core: new Exps.NatCore(),
    }
  }

  format(): string {
    return "Nat"
  }
}
