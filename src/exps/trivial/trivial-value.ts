import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { Solution } from "../../solution"
import * as Exps from "../../exps"
import { ReadbackEtaExpansion } from "../../value"

export class TrivialValue extends Value implements ReadbackEtaExpansion {
  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Exps.TypeValue) {
      return new Exps.TrivialCore()
    }
  }

  readback_eta_expand(ctx: Ctx, value: Value): Core {
    // NOTE the η-rule for trivial states that
    //   all of its inhabitants are the same as sole.
    //   This is implemented by reading the all back as sole.
    return new Exps.SoleCore()
  }

  unify(subst: Solution, that: Value): Solution {
    if (that instanceof Exps.TrivialValue) {
      return subst
    } else {
      return Solution.failure
    }
  }
}
