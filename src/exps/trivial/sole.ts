import { Exp, ExpMeta, subst } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { Solution } from "../../solution"
import * as Exps from "../../exps"

export class Sole extends Exp {
  free_names(bound_names: Set<string>): Set<string> {
    return new Set()
  }

  subst(name: string, exp: Exp): this {
    return this
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    return {
      t: new Exps.TrivialValue(),
      core: new Exps.SoleCore(),
    }
  }

  repr(): string {
    return "sole"
  }
}
