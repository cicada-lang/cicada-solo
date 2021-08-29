import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value, Subst } from "../../value"
import * as Exps from "../../exps"

export class VecnilValue extends Value {
  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Exps.VectorValue) {
      return new Exps.VecnilCore()
    }
  }

  unify(subst: Subst, that: Value): Subst {
    if (that instanceof Exps.VecnilValue) {
      return subst
    } else {
      return Subst.null
    }
  }
}
