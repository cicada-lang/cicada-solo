import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { Subst } from "../../subst"
import * as Exps from "../../exps"

export class SoleValue extends Value {
  readback(ctx: Ctx, t: Value): Core | undefined {
    return new Exps.SoleCore()
  }

  unify(subst: Subst, that: Value): Subst {
    if (that instanceof Exps.SoleValue) {
      return subst
    } else {
      return Subst.empty
    }
  }
}
