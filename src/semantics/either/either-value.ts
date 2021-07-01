import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { readback } from "../../value"
import { Closure } from "../../closure"
import * as ut from "../../ut"
import * as Sem from "../../sem"

export class EitherValue extends Value {
  left_t: Value
  right_t: Value

  constructor(left_t: Value, right_t: Value) {
    super()
    this.left_t = left_t
    this.right_t = right_t
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Sem.TypeValue) {
      return new Sem.EitherCore(
        readback(ctx, new Sem.TypeValue(), this.left_t),
        readback(ctx, new Sem.TypeValue(), this.right_t)
      )
    }
  }
}
