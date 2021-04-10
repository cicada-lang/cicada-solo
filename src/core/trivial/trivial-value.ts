import { Ctx } from "../../ctx"
import { Exp } from "../../exp"
import { Value } from "../../value"
import { TypeValue } from "../../core"
import { Trivial, Sole } from "../../core"

export class TrivialValue {
  readback(ctx: Ctx, t: Value): Exp | undefined {
    if (t instanceof TypeValue) {
      return new Trivial()
    }
  }

  eta_expand(ctx: Ctx, value: Value): Exp {
    // NOTE the η-rule for trivial states that
    //   all of its inhabitants are the same as sole.
    //   This is implemented by reading the all back as sole.
    return new Sole()
  }
}
