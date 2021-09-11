import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { Subst } from "../../subst"
import * as Exps from "../../exps"

export class ZeroValue extends Value {
  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Exps.NatValue) {
      return new Exps.ZeroCore()
    }
  }

  unify(subst: Subst, that: Value): Subst {
    if (that instanceof Exps.ZeroValue) {
      return subst
    } else {
      return Subst.failure
    }
  }
}
