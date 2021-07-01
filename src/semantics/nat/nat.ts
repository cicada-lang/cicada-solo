import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Value } from "../../value"
import * as Sem from "../../sem"

export class Nat extends Exp {
  free_names(bound_names: Set<string>): Set<string> {
    return new Set()
  }

  subst(name: string, exp: Exp): Exp {
    return this
  }

  evaluate(env: Env): Value {
    return new Sem.NatValue()
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    return {
      t: new Sem.TypeValue(),
      core: new Sem.NatCore(),
    }
  }

  repr(): string {
    return "Nat"
  }
}
