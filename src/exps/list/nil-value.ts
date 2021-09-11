import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { Subst } from "../../subst"
import * as Exps from "../../exps"

export class NilValue extends Value {
  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Exps.ListValue) {
      return new Exps.NilCore()
    }
  }

  unify(subst: Subst, that: Value): Subst {
    if (that instanceof Exps.NilValue) {
      return subst
    } else {
      return Subst.failure
    }
  }
}
