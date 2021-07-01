import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import * as Sem from "../../sem"

export class AbsurdValue extends Value {
  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Sem.TypeValue) {
      return new Sem.Absurd()
    }
  }
}
