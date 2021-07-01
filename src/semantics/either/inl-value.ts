import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { readback } from "../../value"
import * as Cores from "../../cores"

export class InlValue extends Value {
  left: Value

  constructor(left: Value) {
    super()
    this.left = left
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Cores.EitherValue) {
      return new Cores.Inl(readback(ctx, t.left_t, this.left))
    }
  }
}
