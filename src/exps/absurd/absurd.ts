import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Exp } from "../../exp"
import { Value } from "../../value"
import * as Cores from "../../cores"

export class Absurd extends Exp {
  free_names(bound_names: Set<string>): Set<string> {
    return new Set()
  }

  subst(name: string, exp: Exp): Exp {
    return this
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    return {
      t: new Cores.TypeValue(),
      core: new Cores.Absurd(),
    }
  }

  repr(): string {
    return "Absurd"
  }
}
