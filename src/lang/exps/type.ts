import { Core } from "../core"
import { Ctx } from "../ctx"
import { Exp, ExpMeta } from "../exp"
import * as Exps from "../exps"
import { Value } from "../value"

export class Type extends Exp {
  meta?: ExpMeta

  constructor(meta?: ExpMeta) {
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
      core: new Exps.TypeCore(),
    }
  }

  format(): string {
    return "Type"
  }
}
