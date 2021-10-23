import { Core } from "../core"
import { Exp, ExpMeta, ElaborationOptions, subst } from "../exp"
import { Ctx } from "../ctx"
import { Value } from "../value"
import * as Exps from "../exps"

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

  repr(): string {
    return "Type"
  }
}
