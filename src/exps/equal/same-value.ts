import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value, Subst } from "../../value"
import * as Exps from "../../exps"

export class SameValue extends Value {
  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Exps.EqualValue) {
      return new Exps.SameCore()
    }
  }

  unify(subst: Subst, that: Value): Subst {
    if (that instanceof Exps.SameValue) {
      return subst
    } else {
      return Subst.null
    }
  }
}
