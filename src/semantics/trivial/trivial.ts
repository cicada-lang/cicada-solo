import { Exp } from "../../exp"
import { Core } from "../../core"
import { Value } from "../../value"
import { Ctx } from "../../ctx"
import * as Sem from "../../sem"

export class Trivial extends Exp {
  free_names(bound_names: Set<string>): Set<string> {
    return new Set()
  }

  subst(name: string, exp: Exp): Exp {
    return this
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    return {
      t: new Sem.TypeValue(),
      core: new Sem.TrivialCore(),
    }
  }

  repr(): string {
    return "Trivial"
  }
}
