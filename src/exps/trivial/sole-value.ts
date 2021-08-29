import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value, Subst } from "../../value"
import * as Exps from "../../exps"

export class SoleValue extends Value {
  readback(ctx: Ctx, t: Value): Core | undefined {
    return new Exps.SoleCore()
  }

  unify(subst: Subst, x: Value): Subst | undefined {
    if (x instanceof Exps.SoleValue) {
      return subst
    }
  }
}
