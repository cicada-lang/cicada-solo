import { Exp, substitute } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { Solution } from "../../solution"
import * as Exps from "../../exps"

export class ClsNil extends Exps.Cls {
  field_names: Array<string> = []

  free_names(bound_names: Set<string>): Set<string> {
    return new Set()
  }

  substitute(name: string, exp: Exp): Exps.Cls {
    return this
  }

  fields_repr(): Array<string> {
    return []
  }

  repr(): string {
    return `class {}`
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    return {
      t: new Exps.TypeValue(),
      core: new Exps.ClsNilCore(),
    }
  }
}
