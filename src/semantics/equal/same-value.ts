import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import * as Cores from "../../cores"

export class SameValue extends Value {
  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Cores.EqualValue) {
      return new Cores.Same()
    }
  }
}
