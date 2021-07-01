import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { check } from "../../exp"
import { evaluate } from "../../core"
import { Value } from "../../value"
import { Trace } from "../../errors"
import * as Exps from "../../exps"
import * as ut from "../../ut"

export class ClsNil extends Exps.Cls {
  free_names(bound_names: Set<string>): Set<string> {
    return new Set()
  }

  subst(name: string, exp: Exp): Exps.Cls {
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
