import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { readback } from "../../readback"
import { Closure } from "../../closure"
import * as ut from "../../ut"
import * as Cores from "../../cores"

export class EitherValue extends Value {
  left_t: Value
  right_t: Value

  constructor(left_t: Value, right_t: Value) {
    super()
    this.left_t = left_t
    this.right_t = right_t
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Cores.TypeValue) {
      return new Cores.Either(
        readback(ctx, new Cores.TypeValue(), this.left_t),
        readback(ctx, new Cores.TypeValue(), this.right_t)
      )
    }
  }
}
