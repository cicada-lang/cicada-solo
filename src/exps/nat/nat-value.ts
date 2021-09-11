import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { Subst } from "../../subst"
import * as Exps from "../../exps"

export class NatValue extends Value {
  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Exps.TypeValue) {
      return new Exps.NatCore()
    }
  }

  unify(subst: Subst, that: Value): Subst {
    if (that instanceof Exps.NatValue) {
      return subst
    } else {
      return Subst.failure
    }
  }
}
