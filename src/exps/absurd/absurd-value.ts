import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { Subst } from "../../subst"
import * as Exps from "../../exps"

export class AbsurdValue extends Value {
  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Exps.TypeValue) {
      return new Exps.AbsurdCore()
    }
  }

  unify(subst: Subst, that: Value): Subst {
    if (that instanceof Exps.AbsurdValue) {
      return subst
    } else {
      return Subst.null
    }
  }
}
