import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { readback } from "../../value"
import { Value } from "../../value"
import * as Sem from "../../sem"

export class EqualValue extends Value {
  t: Value
  from: Value
  to: Value

  constructor(t: Value, from: Value, to: Value) {
    super()
    this.t = t
    this.from = from
    this.to = to
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Sem.TypeValue) {
      return new Sem.EqualCore(
        readback(ctx, new Sem.TypeValue(), this.t),
        readback(ctx, this.t, this.from),
        readback(ctx, this.t, this.to)
      )
    }
  }
}
