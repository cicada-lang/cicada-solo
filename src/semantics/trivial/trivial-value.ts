import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import * as Sem from "../../sem"

export class TrivialValue extends Value {
  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Sem.TypeValue) {
      return new Sem.Trivial()
    }
  }

  eta_expand(ctx: Ctx, value: Value): Core {
    // NOTE the η-rule for trivial states that
    //   all of its inhabitants are the same as sole.
    //   This is implemented by reading the all back as sole.
    return new Sem.Sole()
  }
}
