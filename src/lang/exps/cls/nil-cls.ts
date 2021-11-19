import { Exp, ExpMeta, ElaborationOptions, subst } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { Solution } from "../../solution"
import * as Exps from "../../exps"

export class NilCls extends Exps.Cls {
  meta: ExpMeta
  field_names: Array<string> = []

  constructor(meta: ExpMeta) {
    super()
    this.meta = meta
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set()
  }

  subst(name: string, exp: Exp): Exps.Cls {
    return this
  }

  fields_format(): Array<string> {
    return []
  }

  format(): string {
    return `class {}`
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    return {
      t: new Exps.TypeValue(),
      core: new Exps.NilClsCore(),
    }
  }
}
