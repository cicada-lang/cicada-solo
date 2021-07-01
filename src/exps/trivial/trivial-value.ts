import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import * as Exps from "../../exps"

export class TrivialValue extends Value {
  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Exps.TypeValue) {
      return new Exps.TrivialCore()
    }
  }

  eta_expand(ctx: Ctx, value: Value): Core {
    // NOTE the η-rule for trivial states that
    //   all of its inhabitants are the same as sole.
    //   This is implemented by reading the all back as sole.
    return new Exps.SoleCore()
  }
}
