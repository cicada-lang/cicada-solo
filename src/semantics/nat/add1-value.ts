import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { readback } from "../../value"
import * as Sem from "../../sem"

export class Add1Value extends Value {
  prev: Value

  constructor(prev: Value) {
    super()
    this.prev = prev
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Sem.NatValue) {
      return new Sem.Add1(readback(ctx, t, this.prev))
    }
  }
}
